import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
 
 import { NgpServiceService } from '../Service/ngp-service.service';
 import { DatePipe } from '@angular/common';
 import { HttpClient } from '@angular/common/http';
  import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
 import * as moment from 'moment';
 import Swal from 'sweetalert2';
@Component({
  selector: 'app-listerngp',
  templateUrl: './listerngp.component.html',
  styleUrls: ['./listerngp.component.scss']
})
export class ListerngpComponent implements OnInit {
  sortie: any;

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  form = new FormGroup({ id: new FormControl("") });

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns: string[] = ['id',   'supprimer' ]; //les colonne du tableau 
  dataSource = new MatTableDataSource<table>();


  constructor(  private _formBuilder: FormBuilder, private service: NgpServiceService ) {
    
  }


  supprimer(id:any)
  {
     
      Swal.fire({
        title: 'Êtes-vous sûr?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimez-le',
        cancelButtonText: 'Non, garde le'
      }).then((result) => {
        if (result.value) {
     
          this.service.supprimerngp(id);
          this.Bon_sortie();          
        }
      })
  
  }
   

  filtre( )
   {
     let cle  = this.form.get('id')?.value
    cle = cle.trim(); // Remove whitespace
    cle = cle.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = cle;

   }
  ngOnInit(): void {
    this.Bon_sortie();
 
   }
 
   Bon_sortie() {
       this.service.liste_taxe_ngps().subscribe((data: any) => {
       this.sortie = data;
      // this.sortie= this.sortie.sort((a:any, b:any) => a.id > b.id ? -1 : 1);
       this.dataSource.data = data as table[];
     })
   }

}
export interface table {
  nom: number;
  valeur: string
}