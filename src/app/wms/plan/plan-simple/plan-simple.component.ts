import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { LocalService } from 'src/app/init/local/Service/local.service';
import Swal from 'sweetalert2';
import { ajouter_hall } from '../dialogue/dialogue.component';
import { fabric } from 'fabric';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-plan-simple',
  templateUrl: './plan-simple.component.html',
  styleUrls: ['./plan-simple.component.scss']
})
export class PlanSimpleComponent implements OnInit {
  local: any = FormGroup;
  hall: any = FormGroup;
  echelle: number = 1;
  isLinear = true
  locals: any;
  liste_hall: any = []
  @ViewChild('stepper') private myStepper: any = MatStepper;

  constructor(private _formBuilder: FormBuilder, private Service: LocalService, public dialog: MatDialog) {
    this.local = this._formBuilder.group({
    });
    this.hall = this._formBuilder.group({
    });
    Service.Locals().subscribe((data) => {
      this.locals = data

    })
    localStorage.setItem('liste_rec', JSON.stringify(this.liste_rec)  );
  }


  ngOnInit(): void {
  }

  @ViewChild('myCanvas') myCanvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;
  public context2: CanvasRenderingContext2D;
  public context3: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.init_canvas(50, 100)

    var elem = document.getElementById('c')
    elem.addEventListener('click', function (event) {
      var x = event.pageX
      var y = event.pageY
      console.log(x, y);
    }, false);

  }
  canvas: any;
  public liste_rec  : Array<any> = [];
  init_canvas(nb1: any, nb2: any) {
    this.canvas = new fabric.Canvas('c', { selection: false });
    var gridx = nb1;
    var gridy = nb2;
    for (var i = 0; i < (600 / gridx); i++) {
      this.canvas.add(new fabric.Line([i * gridx, 0, i * gridx, 600], { stroke: '#ccc', selectable: false }));
    }
    for (var i = 0; i < (600 / gridy); i++) {
      this.canvas.add(new fabric.Line([0, i * gridy, 600, i * gridy], { stroke: '#ccc', selectable: false }))
    }
    // snap to grid
    this.liste_rec =  JSON.parse(localStorage.getItem('liste_rec'));
    
    for (var i = 0; i < this.liste_rec.length; i++) {
      this.canvas.add( new fabric.Rect({
        left: this.liste_rec[i].x,
        top: this.liste_rec[i].y,
        width: 50,
        height: 100,
        // fill: c,
        originX: 'left',
        originY: 'top',
      }))
    }
 
    this.canvas.on('object:moving', function (options) {
      options.target.set({
        left: Math.round(options.target.left / gridx) * gridx,
        top: Math.round(options.target.top / gridy) * gridy
      });
    });
    this.canvas.on('mouse:up', function (event) {
      var left = Math.round(event.pointer.x / gridx) * gridx
      var top = Math.round(event.pointer.y / gridy) * gridy
      this.obj = {}
      this.obj.x=left;
      this.obj.t=top;
      var liste_rec =  JSON.parse(localStorage.getItem('liste_rec'));
      liste_rec.push(this.obj)
      localStorage.setItem('liste_rec', JSON.stringify(liste_rec)  );
      Swal.fire({
        title: 'info',
        text: 'ajouter ',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'oui',
        cancelButtonText: 'non'
      }).then((result) => {

        if (result.isConfirmed) {          
            this.init_canvas(50,100)   
        }
      })
      // this.canvas = new fabric.Canvas('c', { selection: false });

      // var rec = new fabric.Rect({
      //   left: left,
      //   top: top,
      //   width: 50,
      //   height: 100,
      //   // fill: c,
      //   originX: 'left',
      //   originY: 'top',
      // });
      // var text = new fabric.Text('A', {
      //   fill: 'green',
      //   left: 20,
      //   top: 45,
      //   fontSize: 12
      // });
      // var g = new fabric.Group([rec, text], {
      //   // any group attributes here
      // });
       
      // this.canvas.add(g);  
      // this.ajouter_rec(left,top,'#7CFC00')
    });



  }

  event_mouse(nb1: any, nb2: any) {
    this.canvas = new fabric.Canvas('c', { selection: false });
    var gridx = nb1;
    var gridy = nb2;    
    // snap to grid 
    this.canvas.on('object:moving', function (options) {
      options.target.set({
        left: Math.round(options.target.left / gridx) * gridx,
        top: Math.round(options.target.top / gridy) * gridy
      });
    });
    this.canvas.on('mouse:up', function (event) {
      var left = Math.round(event.pointer.x / gridx) * gridx
      var top = Math.round(event.pointer.y / gridy) * gridy
      this.canvas = new fabric.Canvas('c', { selection: false });
      this.init_canvas(nb1,nb2)
      var rec = new fabric.Rect({
        left: left,
        top: top,
        width: 50,
        height: 100,
        // fill: c,
        originX: 'left',
        originY: 'top',
      });
      var text = new fabric.Text('A', {
        fill: 'green',
        left: 20,
        top: 45,
        fontSize: 12
      });
      var g = new fabric.Group([rec, text], {
        // any group attributes here
      });      
      this.canvas.add(g);  
      // this.ajouter_rec(left,top,'#7CFC00')
    });



  }

  info_local: any;
  obj_hall: any
  creation_hall(id: any) {
    this.Service.Local(id).subscribe((data) => {
      this.info_local = data
      this.context = this.myCanvas.nativeElement.getContext('2d');
      this.context.canvas.height = Number(this.info_local.largeur * this.echelle);
      this.context.canvas.width = Number(this.info_local.profondeur * this.echelle);
      //  this.fn_hall()
      this.myStepper.next();


    })

  }

  ajouter_hall() {
    this.obj_hall = {}
    this.obj_hall.x = 0;
    this.obj_hall.y = 0;
    this.obj_hall.l = 0;
    this.obj_hall.p = 0;
    const dialogRef = this.dialog.open(ajouter_hall, {
      width: 'auto', data: { obj: this.obj_hall }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (Number(this.obj_hall.l) == 0 || Number(this.obj_hall.l) == 0 || this.obj_hall.titre + "" == "") {
        Swal.fire(
          'error ',
          'merci de vérifier les données',
          'error'
        )
      }
      else {
        this.fn_creer(this.obj_hall.x, this.obj_hall.y, this.obj_hall.l, this.obj_hall.p, this.obj_hall.couleur, this.obj_hall.titre);

        this.liste_hall.push(this.obj_hall)
      }
    });

  }
  supprimer() {


  }

  ajouter_hall2(c: any) {
    var rec = new fabric.Rect({
      left: 0,
      top: 0,
      width: 50,
      height: 100,
      fill: c,
      originX: 'left',
      originY: 'top',
    });
    var text = new fabric.Text('A', {
      fill: 'green',
      left: 20,
      top: 45,
      fontSize: 12
    });
    var g = new fabric.Group([rec, text], {
      // any group attributes here
    });

    this.canvas.add(g);
    // this.canvas.add(text);

  }

  ajouter_rec(x: any, y: any, c: any) {
    var rec = new fabric.Rect({
      left: x,
      top: y,
      width: 50,
      height: 100,
      // fill: c,
      originX: 'left',
      originY: 'top',
    });
    var text = new fabric.Text('A', {
      fill: 'green',
      left: 20,
      top: 45,
      fontSize: 12
    });
    var g = new fabric.Group([rec, text], {
      // any group attributes here
    });
    this.canvas.add(g);
    // this.canvas.add(text);

  }

  // trecer tous les hall 
  fn_hall() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    for (let i = 0; i < this.liste_hall.length; i++) {
      this.fn_creer(this.liste_hall[i].x, this.liste_hall[i].y, this.liste_hall[i].l, this.liste_hall[i].p, this.liste_hall[i].couleur, this.liste_hall[i].titre)
    }
  }
  // creer un hall x 
  fn_creer(x: any, y: any, l: any, p: any, c: any, titre: any) {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.context2 = this.myCanvas.nativeElement.getContext('2d');
    this.context3 = this.myCanvas.nativeElement.getContext('2d');
    this.context3.font = '12px serif';
    let xtitre: number = ((((x * this.echelle) + (l * this.echelle)) - (x * this.echelle)) / 2)
    let ytitre: number = ((((y * this.echelle) + (p * this.echelle)) - (y * this.echelle)) / 2)
    this.context2.fillStyle = c + "";
    this.context.fillRect((x * this.echelle), (y * this.echelle), (l * this.echelle), (p * this.echelle));
    this.context3.fillStyle = '#000000';
    this.context3.fillText('' + titre, xtitre, ytitre);
  }

  // zoom plus 
  plus() {
    if (this.echelle < 5) {
      this.echelle = Number(this.echelle = this.echelle * 2)
      this.fn_hall()
    }
  }
  // zoom moins
  moins() {
    if (this.echelle > 0.2) {
      this.echelle = Number(this.echelle = this.echelle / 2)
      this.fn_hall()
    }
  }

}



