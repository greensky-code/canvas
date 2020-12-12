import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import io from 'socket.io-client'
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CanvasService } from '../services/canvas.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../modal/add-user/add-user.component';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.css']
})
export class StudioComponent implements OnInit {
  @ViewChild("board")
  private boardCanvas: ElementRef
  private boardCanvas2: ElementRef;
  private context;
  private context2;
  private socket;
  private socketMouseX = 0
  private socketMouseY = 0
  private socketStartingX = 0
  private recentWords = []
  private undoList = []
  private allAction = []
  outline = "black"
  name;
  id
  mode;
  image;
  canvas
  user;
  addFlag = false
  colors = [
    { id: 1, color: "black" },
    { id: 2, color: "white" },
    { id: 3, color: "yellow" },
    { id: 4, color: "red" },
    { id: 5, color: "blue" },
    { id: 5, color: "green" },

  ]
  badCodes = [16, 18, 20, 17, 90]
  eraser = false;
  eraseValue = 'invert(1)'
  constructor(private document: Document,
    public authService: AuthService,
    public route: ActivatedRoute,
    private canvasService: CanvasService,
    public router: Router,
    public toastr: ToastrService,
    public dialog: MatDialog) { }
  ngOnInit() {
    this.socket = io("http://localhost:3000")
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('image')) {
        this.addFlag = true
        this.mode = 'new'
        this.image = paramMap.get("image")
        this.id = paramMap.get('id')
        this.canvasService.getCanvasById(this.id).subscribe((res: any) => {
          this.canvas = res.data
        })
        this.name = paramMap.get('name')
      }
      else if (paramMap.has('id')) {
        this.mode = 'edit'
        this.id = paramMap.get('id')
        this.getMe().subscribe((resp: any) => {
          
          this.user = resp.data
          console.log(this.user);
          this.canvasService.getCanvasById(this.id).subscribe((res: any) => {
            console.log(res);
            this.image = res.data.backImage
            
            this.canvas = res.data
            if (!this.canvas.users.includes(resp.data._id)) {
              this.toastr.warning("UnAuthorized")
              return this.router.navigate(["/home"])
            }
            this.AddEditCanvas(res.data.image)
            this.name = res.data.name
            if (this.user._id === this.canvas.owner) {
              this.addFlag = true
            }

          })

        })
      } else {

      }
    })
    setInterval(() => {
      this.saveToDb()
    }, 5000);
  }
  ngAfterViewInit() {
    let painting = false
    let erasing = false;
    let mouseX = 0
    let mouseY = 0
    let startingX = 0
    this.saveState()
    this.saveAllAction()
    this.context = this.boardCanvas.nativeElement.getContext("2d")
    this.boardCanvas.nativeElement.addEventListener("mouseup", () => {
      this.saveAllAction()      
      painting = false
      erasing = false
      this.context.beginPath()
      this.socket.emit("ended")
    })
    if (this.mode === 'new') {
      this.addImage(this.image)
    }
    this.boardCanvas.nativeElement.addEventListener("mousedown", (e) => {
      if (this.eraser) {
        erasing = true
        this.erase(e, erasing,this.context)
      } else {
        painting = true
        this.draw(e, painting, this.context)
      }
      
    })
    this.boardCanvas.nativeElement.addEventListener("mousemove", (e) => {
      if (this.eraser) {
        this.erase(e,erasing,this.context)
      } else {
        
        this.draw(e, painting, this.context)
      }
    })
    this.boardCanvas.nativeElement.addEventListener("click", (e) => {
      mouseX = e.pageX - this.boardCanvas.nativeElement.offsetLeft
      mouseY = e.pageY - this.boardCanvas.nativeElement.offsetTop
      startingX = mouseX
      this.socket.emit("typePos", { x: mouseX, y: mouseY })
      this.recentWords = []
    })
    this.document.addEventListener("keydown", (e) => {

      if (e.keyCode === 13) {
        mouseX = startingX
        mouseY += 20
      }
      else if (this.badCodes.includes(e.keyCode)) {
        return
      }
      else if (e.keyCode === 8) {
        this.undo()
        let recentWord = this.recentWords[this.recentWords.length - 1]
        mouseX -= this.context.measureText(recentWord).width
        this.recentWords.pop()
      } else {
        this.context.font = "16px Arial"
        this.context.fillStyle = this.outline
        this.context.fillText(e.key, mouseX, mouseY)
        mouseX += this.context.measureText(e.key).width
        this.saveState()
        this.saveAllAction()
        this.recentWords.push(e.key)
        let typed = { key: e.key, x: mouseX, y: mouseY, color: this.outline }
        this.socket.emit('typed', typed)

      }
    })
    this.socket.on("new", res => {
      console.log(res);
    })
    this.socket.on("mouse", (data) => {
      this.socketDraw(data, this.context)
    })
    this.socket.on("ended", () => {
      this.socketEnd(this.context)
    })
    // this.socket.on("color", (data) => {
    //   this.soceketColor(data, this.context)
    // })
    this.socket.on("image", (data) => {
      this.socketImage(data, this.context)
    })
    this.socket.on("typed", (data) => {
      this.socketTyped(data, this.context)
    })
    this.socket.on("typePos", (data) => {
      this.socketTypePos(data)
    })
    this.socket.on("undo", (data) => {
      this.socketUndo(data)
    })
    this.socket.on("undoAll", (data) => {
      this.socketUndoAll(data)
    })
    this.socket.on("erase", (data) => {
      this.socketErase(data, this.context)
    })
  }

  draw(e, painting, context) {
    this.context = context
    if (!painting) {
      return
    }
    this.context.strokeStyle = this.outline
    this.context.lineWidth = 1
    this.context.lineCap = "round"
    this.context.lineTo(e.pageX - this.boardCanvas.nativeElement.offsetLeft, e.pageY - this.boardCanvas.nativeElement.offsetTop)
    this.context.stroke()
    this.context.beginPath()
    this.context.moveTo(e.pageX - this.boardCanvas.nativeElement.offsetLeft, e.pageY - this.boardCanvas.nativeElement.offsetTop)
    let data = {
      x: e.pageX - this.boardCanvas.nativeElement.offsetLeft,
      y: e.pageY - this.boardCanvas.nativeElement.offsetTop,
      color: this.outline
    }
    this.socket.emit('mouse', data)
  }
  erase(e, erasing, context) {
    
    if (!erasing) {
      return
    }
    // this.boardCanvas2 = this.boardCanvas.nativeElement
    // this.context = context
    // this.context2 = context
    // // console.log(this.context2);
    // this.context2.drawImage(this.boardCanvas.nativeElement, 0, 0)
    this.context.clearRect(e.pageX - this.boardCanvas.nativeElement.offsetLeft, e.pageY - this.boardCanvas.nativeElement.offsetTop, '20', '20')
    let data = {
      x: e.pageX - this.boardCanvas.nativeElement.offsetLeft,
      y: e.pageY - this.boardCanvas.nativeElement.offsetTop,
      width: '20'
    }
    this.socket.emit('erase', data)
    // const background = new Image()
    // background.setAttribute('crossorigin', 'anonymous');
    // background.src = this.image
    // background.onload = () => {
    //   this.context.drawImage(background, 0, 0,1000, 700)
    // // }
    // this.context = this.context2
  }
  socketErase(data, context) {
    this.context = context
    this.context.clearRect(data.x, data.y, data.width, data.width)
  }
  socketDraw(data, context) {
    this.context = context
    this.context.strokeStyle = data.color
    this.context.lineWidth = 1
    this.context.lineCap = "round"
    this.context.lineTo(data.x, data.y)
    this.context.stroke()
    this.context.beginPath()
    this.context.moveTo(data.x, data.y)
  }
  socketEnd(context) {
    this.context = context
    this.context.beginPath()
  }
  addImage(image) {
    // const background = new Image()
    // background.setAttribute('crossorigin', 'anonymous');
    // background.src = image
    // background.onload = () => {
    //   this.context.drawImage(background, 0, 0, 1000, 700)
    // }
    // this.socket.emit("image", image)
  }
  addColor(color) {
    this.disableEraser()
    this.context.strokeStyle = color
    this.context.fillStyle = color
    this.outline = color
    // this.socket.emit("color", color)
  }
  disableEraser() {
    this.eraser = false
    this.eraseValue = 'invert(1)'
  }
  pickEraser() {
    if (!this.eraser) {
      this.eraser = true
      this.eraseValue = 'invert(0)'
    }else{
      this.eraser = false
      this.eraseValue = 'invert(1)'
    }
  }
  getOutline(color) {
    if (this.outline === color) {
      return '5px solid ' + color
    } else {
      return ""
    }
  }
  // soceketColor(data, context) {
  //   this.context = context
  //   this.context.strokeStyle = data
  // }
  socketImage(data, context) {
    this.context = context
    const background = new Image()
    background.setAttribute('crossorigin', 'anonymous');
    background.src = data
    background.onload = () => {
      this.context.drawImage(background, 0, 0, 400, 500)
    }
  }
  socketTyped(data, context) {
    this.context = context
    this.context.font = "16px Arial"
    this.context.fillStyle = data.color
    this.context.fillText(data.key, this.socketMouseX, this.socketMouseY)
    this.socketMouseX += this.context.measureText(data.key).width

  }
  socketTypePos(data) {
    this.socketMouseX = data.x
    this.socketMouseY = data.y
    this.socketStartingX = this.socketMouseX
  }
  socketUndo(data) {
    let image = new Image()
    image.src = data
    image.onload = () => {
      this.context.clearRect(0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
      this.context.drawImage(image, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
    }
  }
  socketUndoAll(data) {
    let image = new Image()
    image.src = data
    image.onload = () => {
      this.context.clearRect(0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
      this.context.drawImage(image, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
    }
  }
  saveState() {
    this.undoList.push(this.boardCanvas.nativeElement.toDataURL())
  }
  saveAllAction() {
    this.allAction.push(this.boardCanvas.nativeElement.toDataURL())
    console.log(this.allAction);
    
  }
  undoAll() {
    this.disableEraser()
    if (this.allAction.length === 2) {
      return this.toastr.warning("Unable to undo")
    }
    this.allAction.pop()
    console.log("imhere", this.allAction.length);
    let imageData = this.allAction[this.allAction.length-1]
    let image = new Image()
    image.setAttribute('crossorigin', 'anonymous');
    image.src = imageData
    image.onload = () => {
      this.context.clearRect(0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
      this.context.drawImage(image, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
    }
    this.socket.emit('undoAll', imageData)
  }
  undo() {

    if (this.undoList.length === 2) {
      return
    }
    this.undoList.pop()
    let imageData = this.undoList[this.undoList.length - 1]
    let image = new Image()
    image.setAttribute('crossorigin', 'anonymous');
    image.src = imageData
    image.onload = () => {
      this.context.clearRect(0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
      this.context.drawImage(image, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
    }
    this.socket.emit('undo', imageData)
  }
  saveToDb() {
    let data = {
      image: this.boardCanvas.nativeElement.toDataURL()
    }
    this.canvasService.updateCanvas(this.id, data).subscribe(res => {

    })
  }
  AddEditCanvas(data) {
    let image = new Image()
    image.setAttribute('crossorigin', 'anonymous');
    image.src = data
    image.onload = () => {
      this.context.clearRect(0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
      this.context.drawImage(image, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height, 0, 0, this.boardCanvas.nativeElement.width, this.boardCanvas.nativeElement.height)
    }
    this.saveAllAction()
  }
  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '600px',
      data: { users: this.canvas.users, id: this.canvas._id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  logout() {
    this.authService.clearAuthData()
  }
  getMe() {
    return this.authService.getLoggedInUser()
  }
  backgroundImage() {
    return `url(${this.image})`
  }
  // broadCastState() {
  // }
}
