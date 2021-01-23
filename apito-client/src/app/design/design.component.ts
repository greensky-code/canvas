import { Component, OnInit, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TextNodeService } from '../services/text-node.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import io from 'socket.io-client';
import { AuthService } from '../services/auth.service';
import { CanvasService } from '../services/canvas.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../modal/add-user/add-user.component';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements OnInit, OnDestroy {
  options: FormGroup;
  colorControl = new FormControl('primary');
  fontSizeControl = new FormControl(30, Validators.min(10));
  shapes: any = [];
  socketShapes: any = [];
  private socket;
  colors = [
    { id: 1, color: "black" },
    { id: 2, color: "white" },
    { id: 3, color: "yellow" },
    { id: 4, color: "red" },
    { id: 5, color: "blue" },
    { id: 5, color: "green" },

  ]
  socketLastLine
  selectedButton: any = {
    'line': false,
    'undo': false,
    'erase': false,
    'text': false
  }
  text;
  id
  mode;
  image;
  name;
  user;
  readyToexit: Boolean = false
  canvas;
  invertString = "invert(1)"
  stage: Konva.Stage;
  layer: Konva.Layer;
  socketLayer: Konva.Layer;
  erase: boolean = false;
  transformers: Konva.Transformer[] = [];
  socketTransformers: Konva.Transformer[] = [];
  outline = "black";
  eraser = false;
  addFlag = false
  ownerCanvas = false
  allShapes;
  constructor(
    private textNodeService: TextNodeService,
    fb: FormBuilder,
    public route: ActivatedRoute,
    public authService: AuthService,
    private canvasService: CanvasService,
    public router: Router,
    public toastr: ToastrService,
    public dialog: MatDialog) {
    this.options = fb.group({
      color: this.colorControl,
      fontSize: this.fontSizeControl,
    });
  }
  getFontSize() {
    return Math.max(10, this.fontSizeControl.value);
  }
  save = true;
  intervalId;
  saveTo = false
  ngOnInit(): void {
    // this.socket = io("http://18.216.138.108:3000")
    this.socket = io("https://apito-server.herokuapp.com")
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('image')) {
        this.addFlag = true
        this.mode = 'new'
        this.image = paramMap.get("image")
        this.id = paramMap.get('id')
        this.getMe().subscribe((resp: any) => {
          this.user = resp.data
          this.socket.emit('joinCanvas', { canvasId: this.id, userId: this.user._id })
          this.socketBlock()

          this.canvasService.getCanvasById(this.id).subscribe((res: any) => {
            this.canvas = res.data
            console.log(this.canvas);

          })
          this.name = paramMap.get('name')
          this.stage = new Konva.Stage({
            container: 'container',
            width: 900,
            height: 500
          });
          this.layer = new Konva.Layer();
          this.socketLayer = new Konva.Layer()
          this.stage.add(this.layer);
          this.stage.add(this.socketLayer)
          this.canvasService.getAllShapes(this.id).subscribe((res: any) => {
            console.log(res);
            this.allShapes = res.data
            let shapes = this.allShapes.find(shape => shape.owner === this.user._id)
            let userShapesIndex = this.allShapes.findIndex(shape => shape.owner === this.user._id)
            if (userShapesIndex >= 0) {
              this.allShapes.splice(userShapesIndex, 1)
            }
            console.log(this.allShapes, shapes, userShapesIndex);


            if (shapes.shape.length > 0) {
              for (let i = 0; i < shapes.shape.length; i++) {
                const element = shapes.shape[i];
                console.log(element);
                let node = Konva.Node.create(element.shape)
                node._id = element.id
                let type = node.getClassName()
                if (type === "Text") {
                  node.draggable(false)
                }
                this.shapes.push(node)
                this.layer.add(node)
              }
            }
            if (this.allShapes.length > 0) {
              for (let i = 0; i < this.allShapes.length; i++) {
                const userLayers = this.allShapes[i];
                for (let j = 0; j < userLayers.shape.length; j++) {
                  const element = userLayers.shape[j];
                  let node = Konva.Node.create(element.shape)
                  node._id = element.id
                  let type = node.getClassName()
                  if (type === "Text") {
                    node.draggable(false)
                  }
                  this.socketShapes.push(node)
                  this.socketLayer.add(node)
                }
              }
            }
            this.layer.draw()
            this.socketLayer.draw()
            this.addLineListeners()
            this.onChanges()
            this.textNodeService.textSize(this.getFontSize())
            // this.localStore()

          })
        })
        // if (shapes) {
        //   for (let i = 0; i < shapes.length; i++) {
        //     const element = shapes[i];
        //     let node = Konva.Node.create(element.shape)
        //     node._id = element.id
        //     let type = node.getClassName()
        //     if (type === "Text") {
        //       node.draggable(false)
        //     }
        //     this.shapes.push(node)
        //     this.layer.add(node)
        //   }
        // }
        // if (socketShapes) {
        //   for (let i = 0; i < socketShapes.length; i++) {
        //     const element = socketShapes[i];
        //     let node = Konva.Node.create(element.shape)
        //     node._id = element.id
        //     let type = node.getClassName()
        //     if (type === "Text") {
        //       node.draggable(false)
        //     }
        //     this.socketShapes.push(node)
        //     this.socketLayer.add(node)
        //   }
        // }
        // this.layer.draw()
        // this.addLineListeners()
        // this.onChanges()
        // this.textNodeService.textSize(this.getFontSize())
      }
      else if (paramMap.has('id')) {
        this.mode = 'edit'
        this.id = paramMap.get('id')
        this.getMe().subscribe((resp: any) => {

          this.user = resp.data
          this.socket.emit('joinCanvas', { canvasId: this.id, userId: this.user._id })
          this.socketBlock()
          this.canvasService.getCanvasById(this.id).subscribe((res: any) => {
            this.image = res.data.backImage

            this.canvas = res.data

            if (!this.canvas.users.includes(resp.data._id)) {
              this.toastr.warning("UnAuthorized")
              return this.router.navigate(["/home"])
            }
            this.name = res.data.name
            this.getShapes()
            if (this.user._id === this.canvas.owner) {
              this.addFlag = true
            }

          })

        })
      }
    })

    // this.intervalId = setInterval(() => {
    //   console.log(this.save);
    //   if (this.save) {
    //     this.saveToDb()

    //   } else {
    //     clearInterval(this.intervalId)
    //   }
    // }, 10000);
    // let width = window.innerWidth * 0.9;
    // let height = window.innerHeight;


  }
  ngAfterViewInit() {

  }
  socketBlock() {
    this.textNodeService.addSocket(this.socket)
    this.socket.on("new", res => {
      console.log(res);
    })
    this.socket.on("message", res => {
      console.log(res);

    })
    this.socket.on("line", (data) => {
      this.socketLine(data)
    })
    this.socket.on("linePoint", (data) => {
      this.socketLinePoint(data)
    })
    this.socket.on("konvaUndo", (data) => {
      this.sockUndo(data)
    })
    // this.socket.on("texting", (data) => {
    //   this.socketTexting(data)
    // })
    this.socket.on('text', (data) => {
      this.socketText(data)
    })
    this.socket.on('textDrag', (data) => {
      this.socketTextDrag(data)
    })
    this.socket.on('saved', () => {
      // this.ngOnInit()
      this.socketSaved()
      console.log("i have saved");

    })
  }
  getOutline(color) {
    if (this.outline === color) {
      return '5px solid ' + color
    } else {
      return ""
    }
  }
  backgroundImage() {
    return `url(${this.image})`
  }
  clearSelection() {
    Object.keys(this.selectedButton).forEach(key => {
      this.selectedButton[key] = false;
    })
  }
  addLineListeners() {
    const component = this;
    let lastLine;
    let isPaint;
    this.stage.on('mousedown touchstart', function (e) {

      if (!component.selectedButton['line'] && !component.erase) {
        return;
      }
      isPaint = true;
      let pos = component.stage.getPointerPosition();
      const mode = component.erase ? 'erase' : 'brush';
      let stroke = 2
      if (mode === "erase") {
        stroke = 15
      }
      lastLine = new Konva.Line({
        stroke: component.outline,
        strokeWidth: stroke,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y],
        draggable: false
      });

      let data = {
        stroke: component.outline,
        strokeWidth: stroke,
        globalCompositeOperation: 'source-over',
        points: [pos.x, pos.y],
        draggable: false,
        id: lastLine._id
      }
      if (mode === 'erase') {
        data = {
          stroke: component.outline,
          strokeWidth: stroke,
          globalCompositeOperation: 'destination-out',
          points: [pos.x, pos.y],
          draggable: false,
          id: lastLine._id
        }
      }
      lastLine.on('dragstart', (e) => {

      })
      lastLine.on('dragend', (e) => {

      })

      component.shapes.push(lastLine);
      component.layer.add(lastLine);
      component.socket.emit('line', data)
      // component.localStore()

    });
    this.stage.on('mouseup touchend', function () {
      isPaint = false;
    });
    // and core function - drawing
    this.stage.on('mousemove touchmove', function () {
      if (!isPaint) {
        return;
      }

      const pos = component.stage.getPointerPosition();
      var newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);

      component.layer.batchDraw();
      const data = {
        lastLine,
        newPoints
      }

      component.socket.emit('linePoint', data)
    });
  }
  addColor(color) {
    this.outline = color
    this.textNodeService.textColor(this.outline)
    if (this.text) {
      this.text.textNode.fill(this.outline)
    }
  }
  setSelection(type: string) {
    this.selectedButton[type] = true;
  }
  addShape(type: string) {
    this.clearSelection();
    this.setSelection(type);
    if (type == 'line') {
      this.addLine();
    }
    else if (type == 'text') {
      this.addText();
    }
  }
  addLine() {
    this.selectedButton['line'] = true;
  }
  addText() {
    let text = this.textNodeService.textNode(this.stage, this.layer, this.outline);
    console.log(this.text);
    text.subscribe(res => {
      this.text = res
      this.text.textNode.on('dragstart', (e) => {
      })
      this.text.textNode.on('dragend', (e) => {
        let data: any = {
          id: e.target._id,
          attr: e.target.attrs,
          clientX: e.evt.clientX,
          clientY: e.evt.clientY
        }

        this.socket.emit("textDrag", data)
      })
      this.shapes.push(this.text.textNode);
      this.transformers.push(this.text.tr);
      // this.localStore()

    })

  }
  invertValue(string) {
    if (this.selectedButton[string]) {
      return "invert(0)"
    } else {
      return "invert(1)"
    }
  }
  undo() {
    const removedShape = this.shapes.pop();
    if (removedShape) {
      removedShape.remove();
      // this.localStore()
      this.layer.draw();
      this.socket.emit('konvaUndo', removedShape._id)
    }
  }
  sockUndo(id) {

    let shape = this.socketShapes.find(element => element._id === id)
    let index = this.socketShapes.findIndex(element => element._id === id)
    this.socketShapes.splice(index, 1)
    if (shape) {
      shape.remove();
      // this.localStore()
    }
    this.socketLayer.draw()

    // const removedShape = this.shapes.pop();
    // this.transformers.forEach(t => {
    //   t.detach();
    // });
    // if (removedShape) {
    //   removedShape.remove();
    // }
    // this.layer.draw();
  }

  // onChanges(): void {
  //   this.options.get('fontSize').valueChanges.subscribe(val => {
  //     console.log(`My name is ${val}.`);
  //   });
  // }
  onChanges(): void {
    this.fontSizeControl.valueChanges.subscribe(val => {
      this.textNodeService.textSize(this.getFontSize())
      if (this.text) {
        this.text.textNode.fontSize(this.getFontSize())
      }
    });

  }
  socketLine(data) {
    this.socketLastLine = new Konva.Line(data)
    this.socketLastLine._id = data.id
    this.socketShapes.push(this.socketLastLine);
    this.socketLayer.add(this.socketLastLine);
    // this.localStore()
  }
  socketLinePoint(data) {
    this.socketLastLine.points(data.newPoints)
    this.socketLayer.batchDraw()

  }

  socketText(data) {
    let node = JSON.parse(data.node)
    node.attrs["visible"] = true
    node.attrs["draggable"] = false
    let simpleText = new Konva.Text(node.attrs);
    let tr = new Konva.Transformer({
      node: simpleText as any,
      enabledAnchors: ['middle-left', 'middle-right'],
      // set minimum width of text
      // boundBoxFunc: function (oldBox, newBox) {
      //   newBox.width = Math.max(30, newBox.width);
      //   return newBox;
      // }
    })
    simpleText._id = data.id
    this.socketLayer.add(simpleText)
    this.socketLayer.draw()
    this.socketShapes.push(simpleText)
    this.socketTransformers.push(tr)
    // this.localStore()

  }
  socketTextDrag(data) {
    console.log(data);

    let shape = this.socketShapes.find(element => element._id === data.id)
    let index = this.socketShapes.findIndex(element => element._id === data.id)
    this.socketShapes.splice(index, 1)
    shape.remove()
    data.attr["draggable"] = false;
    let simpleText = new Konva.Text(data.attr);
    simpleText._id = data.id
    this.socketLayer.add(simpleText)
    this.socketLayer.draw()
    this.socketShapes.push(simpleText)
    // this.localStore()



  }
  getMe() {
    return this.authService.getLoggedInUser()
  }
  saveToDb() {
    this.saveTo = true;
    this.readyToexit = true;
    let shapes = []
    this.shapes.forEach(element => {
      let shapeObj = {}
      shapeObj["id"] = element._id
      shapeObj["shape"] = element
      shapes.push(shapeObj)
    });
    console.log(shapes, this.shapes);

    let data = {
      stage: this.stage.toJSON(),
      shape: shapes,
    }

    this.canvasService.updateCanvas(this.id, data).subscribe(res => {
      console.log(res);
      this.saveTo = false
    })
  }
  AddEditCanvas(layer, shape) {
    this.ownerCanvas = true
    // this.layer = Konva.Node.create(layer)
    this.layer = new Konva.Layer()
    this.stage.add(this.layer);
    let id = 1
    shape.forEach(element => {
      let node = Konva.Node.create(element)
      node.id(id)
      id++
      this.shapes.push(node)
      this.layer.add(node)
    });
    this.layer.draw()
    this.socketLayer = new Konva.Layer()
    this.stage.add(this.socketLayer)
    this.addLineListeners()
    this.onChanges()
    this.textNodeService.textSize(this.getFontSize())
  }
  AddEditCanvasOthers(socketLayers) {

    this.socketLayer = new Konva.Layer()
    this.stage.add(this.socketLayer)
    let id = 1
    socketLayers.forEach(element => {
      element.shape.forEach(shape => {
        let node = Konva.Node.create(shape)
        node.id(id)
        id++
        this.socketShapes.push(node)
        this.socketLayer.add(node)

      });
    });
    this.socketLayer.draw()

    if (!this.ownerCanvas) {
      this.layer = new Konva.Layer()
      this.stage.add(this.layer)
      this.addLineListeners()
      this.onChanges()
      this.textNodeService.textSize(this.getFontSize())
    }
  }
  logout() {
    this.authService.clearAuthData()
  }
  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '600px',
      data: { users: this.canvas.users, id: this.canvas._id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getShapes() {
    console.log("Here");

    this.stage = new Konva.Stage({
      container: 'container',
      width: 900,
      height: 500
    });
    this.layer = new Konva.Layer()
    this.socketLayer = new Konva.Layer()
    this.stage.add(this.layer);
    this.stage.add(this.socketLayer)
    // let shapes = JSON.parse(localStorage.getItem('shapes'))
    // let socketShapes = JSON.parse(localStorage.getItem('socketShapes'))
    // if (!shapes && !socketShapes) {
    //   shapes = []
    //   socketShapes = []
    // }
    // console.log(shapes, socketShapes);

    // if (shapes) {
    //   for (let i = 0; i < shapes.length; i++) {
    //     const element = shapes[i];
    //     let node = Konva.Node.create(element.shape)
    //     node._id = element.id
    //     let type = node.getClassName()
    //     if (type === "Text") {
    //       node.draggable(false)
    //     }
    //     this.shapes.push(node)
    //     this.layer.add(node)
    //   }
    // }
    // if (socketShapes) {
    //   for (let i = 0; i < socketShapes.length; i++) {
    //     const element = socketShapes[i];
    //     let node = Konva.Node.create(element.shape)
    //     node._id = element.id
    //     let type = node.getClassName()
    //     if (type === "Text") {
    //       node.draggable(false)
    //     }
    //     this.socketShapes.push(node)
    //     this.socketLayer.add(node)
    //   }
    // }
    // this.layer.draw()
    // this.socketLayer.draw()
    // this.addLineListeners()
    // this.onChanges()
    // this.textNodeService.textSize(this.getFontSize())
    this.canvasService.getAllShapes(this.id).subscribe((res: any) => {
      console.log(res);
      this.allShapes = res.data
      let shapes = this.allShapes.find(shape => shape.owner === this.user._id)
      let userShapesIndex = this.allShapes.findIndex(shape => shape.owner === this.user._id)
      if (userShapesIndex >= 0) {
        this.allShapes.splice(userShapesIndex, 1)
      }
      console.log(this.allShapes, shapes, userShapesIndex);


      if (shapes.shape.length > 0) {
        for (let i = 0; i < shapes.shape.length; i++) {
          const element = shapes.shape[i];
          console.log(element);
          let node = Konva.Node.create(element.shape)
          node._id = element.id
          let type = node.getClassName()
          if (type === "Text") {
            node.draggable(false)
          }
          this.shapes.push(node)
          this.layer.add(node)
        }
      }
      if (this.allShapes.length > 0) {
        for (let i = 0; i < this.allShapes.length; i++) {
          const userLayers = this.allShapes[i];
          for (let j = 0; j < userLayers.shape.length; j++) {
            const element = userLayers.shape[j];
            let node = Konva.Node.create(element.shape)
            node._id = element.id
            let type = node.getClassName()
            if (type === "Text") {
              node.draggable(false)
            }
            this.socketShapes.push(node)
            this.socketLayer.add(node)
          }
        }
      }
      this.layer.draw()
      this.socketLayer.draw()
      this.addLineListeners()
      this.onChanges()
      this.textNodeService.textSize(this.getFontSize())
      // this.localStore()

    })
  }
  socketSaved() {
    this.canvasService.getAllShapes(this.id).subscribe((response: any) => {
      console.log(response);
      this.shapes = []
      this.socketShapes = []
      let shapes = response.data
      shapes.forEach(element => {
        if (element.owner === this.user._id) {
          console.log("my work");
          for (let i = 0; i < element.shape.length; i++) {
            const shape = element.shape[i];
            console.log(shape);
            let node = Konva.Node.create(shape.shape)
            node._id = shape.id
            this.shapes.push(node)
          }

        } else {
          console.log("not my work");
          for (let i = 0; i < element.shape.length; i++) {
            const shape = element.shape[i];
            let node = Konva.Node.create(shape.shape)
            node._id = shape.id
            this.socketShapes.push(node)
          }
        }

      });
      console.log(this.shapes, this.socketShapes);

    })
  }
  localStore() {
    setTimeout(() => {
      let shapes = []
      this.shapes.forEach(element => {
        let shapeObj = {}
        shapeObj["id"] = element._id
        shapeObj["shape"] = element
        shapes.push(shapeObj)
      });
      localStorage.setItem("shapes", JSON.stringify(shapes))

    }, 1500);

  }
  ngOnDestroy() {
    this.save = false
    clearInterval(this.intervalId)
    // this.saveToDb().subscribe(res => {
    //   console.log(res);
    //   localStorage.removeItem("shapes")
    //   localStorage.removeItem("socketShapes")

    //   // this.socket.emit('saved')
    // })
  }

  checkExit(){
    debugger;
    if(!this.readyToexit) {
      alert("Save changes befor Exit")
    } else {
      location.href = "/design";
    }

  }

}

