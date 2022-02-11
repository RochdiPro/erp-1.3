import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BonCommandeService } from '../Service/bon-commande.service';
//import { BonCommandeFournisseurService } from 'src/app/bon-commande-fournisseur.service';

@Component({
  selector: 'app-lister-bon-commande',
  templateUrl: './lister-bon-commande.component.html',
  styleUrls: ['./lister-bon-commande.component.scss']
})
 
export class ListerBonCommandeComponent implements OnInit {
   displayedColumns: string[] = ['modifier' , 'id_Bon_Commande','id_Fr' ,'devise', 'date_Livraison',   'mode_livraison', 'mode_reglement'  , 'supprimer']
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  boncommands: any;
  recherche: string = '';
  champ: any;
  liste_champs_bon_Entree_Local: any;
  type_bc:any="";

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  dataSource = new MatTableDataSource<table>();


  //choix  type bc 
  choix_type(event: MatSelectChange) {
 
      this.type_bc = event.value
      this.filtre();

     
  }
   //Récupérer tous fournisseurs
   fournisseurs: any = [];
   Fournisseurs() {
    this.Service.Fournisseurs().subscribe((data: any) => {
      this.fournisseurs = data;
    });
  }
  nom_fr:any="";code_fr:any="";
  //choix de fournisseur 
  choix_fr(event: MatSelectChange) {
    this.nom_fr ="";this.code_fr="";
    this.Service.Fournisseur(event.value).subscribe((data:any)=>{
         this.nom_fr=data.nom_Fournisseur
         this.code_fr=data.id_Fr
    })
    this.filtre();
     
  }
  form = new FormGroup({
    id: new FormControl(""), id_fr: new FormControl(""), date: new FormControl(""),
    livraision: new FormControl(""), reglement: new FormControl(""),
    nom: new FormControl(""), devise: new FormControl("")
  });

  constructor(private datePipe: DatePipe, public Service: BonCommandeService, private http: HttpClient, public datepipe: DatePipe) {
    this.boncommandes();
    this.Fournisseurs();

  }
  ngOnInit(): void {

  }

  boncommandes() {
    this.Service.BonCommandes().subscribe((data: any) => {
      this.boncommands = data;
      this.boncommands = this.boncommands.sort((a: any, b: any) => a.id_Bon_Commande > b.id_Bon_Commande ? -1 : 1);
      this.dataSource.data = data as table[];
    });
  }

  // filtre 5 champs de bon entree
 
  filtre() {
    this.Service.filtre("date_Livraison", this.form.get('date')?.value, "mode_reglement", this.form.get('reglement')?.value,"devise", this.type_bc,
     "id_Fr", this.code_fr,"id_Bon_Commande", this.form.get('id')?.value,"mode_livraison", this.form.get('livraision')?.value,).subscribe((data) => {
      this.dataSource.data = data as table[];
    });
  }
}
export interface table {
  id_Bon_Commande: number;
  description: string;
  date_Creation: string
  Fournisseur: string
  lieu: string
  mode_livraison: string
  mode_reglement: string
  devise:string
}