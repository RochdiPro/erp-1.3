import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
 import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
 
import { LocalService } from '../Service/local.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FormControl, FormGroup } from '@angular/forms';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-lister-local',
  templateUrl: './lister-local.component.html',
  styleUrls: ['./lister-local.component.scss']
})
export class ListerLocalComponent implements OnInit {

  recherche: string = '';
  id: any
  locals: any = [];
  liste_champs_local: any;
  champ: any;
  displayedColumns: string[] = ['editer', 'id_Local', 'nom_Local', 'categorie_Local', 'adresse', 'responsable', 'tel', 'email', 'nature_contrat' , 'supprimer'  ];
  dataSource = new MatTableDataSource<table>();
  
  form = new FormGroup({ 
    id_Local: new FormControl(""),
    nom_Local: new FormControl(""),
    categorie_Local: new FormControl(""), 
    responsable: new FormControl("") ,
    adresse: new FormControl("") ,
    tel: new FormControl("") ,
    email: new FormControl("") ,
    nature_Contrat: new FormControl("") ,
   });
  modele_Local: any;
  modeleSrc: any;
  date_debut: any;
  date_fin: any;
  frais: any;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  constructor(public localService: LocalService, private http: HttpClient, public datepipe: DatePipe) {
    this.recupererLocals();// Récupérer liste des Locaux
    //Charger le modéle de PDF
    this.chargerTemplateLocal();
    this.templatePdfBase64();
    //Récupérer la liste des champs du Local
    this.localService.obtenirListeChampsLocal().subscribe((response: Response) => {
      this.liste_champs_local = response;
    });
    sessionStorage.setItem('Utilisateur', "rochdi");

  }
  ngOnInit(): void {
  }
  //Récuperer tous Locaux
  recupererLocals() {
    this.localService.Locals().subscribe((data: any) => { 
      this.locals = data;
      this.locals = this.locals.sort((a:any, b:any) => a.id_Local > b.id_Local ? -1 : 1);
      this.dataSource.data = data as table[];
      this.locals.paginator = this.paginator; 
     
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //Supprimer local 
  SupprimerLocal(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.localService.supprimerLocal(id);
        Swal.fire(
          'Local Supprimé avec succés!',
          '',
          'success'
        )
        window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    })
  }
  //Champ selectionné
  onOptionsSelectionner(value: string) {
    this.champ = value;
  }
  //Filtrer local
  filtrerLocal() {

    if (this.champ == '' || this.recherche == '') {

      Swal.fire("Champ vide!")
      this.recupererLocals();
    }
    else
      this.localService.filtrerLocal(this.champ, this.recherche).subscribe((response: Response) => {
        this.locals = response;
        if (this.locals == '') {
          Swal.fire("Local non trouvé!")
          this.recupererLocals();
        }
      });

  }
  //Générer PDF
  localData:any;
  genererPDF(id: any) {
    
     //Récupérer local par id
     this.localService.Local(id).subscribe((response: Response) => {
      this.localData = response;
    });
    
    var dd = {
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
        }
      ],
      content: [
        {
          text: '\n\n'
        },
        {
          text: '\n\n'
        },
        {
          text: 'Informations Générales :' + '\n\n',
          fontSize: 15,
          alignment: 'left',
          color: 'black',
          bold: true
        },
        {
          columns: [
            {
              text: 'Id Local :' + this.localData.id_Local + '\t' + '\n\n' + ' Nom Local :' + this.localData.nom_Local + '\t' + '\n\n'
                + 'Catégorie Local :' + this.localData.categorie_Local + '\t' + '\n\n' + ' Adresse Local :' + this.localData.adresse + '\t' + '\n\n'
                + 'Responsable :' + this.localData.responsable + '\t' + '\n\n' + 'Fax :' + this.localData.fax
              ,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            },
            {
              text: 'Email :' + this.localData.email + '\t' + '\n\n' + 'Nature Contrat :' + this.localData.nature_Contrat + '\t' + '\n\n' + this.localData.date_Debut + '\t' + '\n\n' + this.localData.date_Fin + '\t' + '\n\n'
                + this.localData.frais + '\t' + '\n\n' + 'Tél.Mobile :' + this.localData.tel,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            },
          ]
        },
        {
          text: '\n\n'
        },
        {
          text: 'Informations Spécifiques :' + '\n\n',
          fontSize: 15,

          alignment: 'left',

          color: 'black',
          bold: true
        },
        {
          columns: [
            {
              text: 'Largeur(m) :' + this.localData.largeur + '\t' + '\n\n' + 'Hauteur(m) :' + this.localData.hauteur
              ,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            },
            {
              text: 'Profondeur(m) :' + this.localData.profondeur + '\t' + '\n\n' + 'Surface(m²) :' + this.localData.surface
              ,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            },
          ]
        },
        {
          text: '\n\n'
        },
        {
          text: 'Note :' + this.localData.description_Local + '\t'
          ,
          fontSize: 10,
          alignment: 'left',
          color: 'black'
        }
        ,
      ],
      footer: function (currentPage: any, pageCount: any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [
                {
                  text: currentPage.toString() + '/' + pageCount,
                }
              ],
              alignment: 'center'
            }
          ]
        };
      },
      pageMargins: [40, 125, 40, 60],
    };
    pdfMake.createPdf(dd).open();
  }
  //Fixer le temps de chargement du modéle
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //Définir le modéle pour pdf 
  async templatePdfBase64() {
    await this.delai(3000);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.modeleSrc = reader.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    reader.readAsDataURL(this.modele_Local);
  }
  //Charger le modéle de PDF
  async chargerTemplateLocal() {
    this.http.get('.././assets/images/Local.jpg', { responseType: 'blob' }).subscribe((resp: any) => {
      this.modele_Local = resp;
      return this.modele_Local;
    }, err => console.error(err),
      () => console.log())
  }

  filtre_lo()
  {
   
    this.localService.filtre_7champs(
       
       "categorie_Local", this.form.get('categorie_Local')?.value,
     "id_Local", this.form.get('id_Local')?.value,
      "nom_Local", this.form.get('nom_Local')?.value,
      "adresse", this.form.get('adresse')?.value,
      "email", this.form.get('email')?.value,
      "nature_Contrat", this.form.get('nature_Contrat')?.value,
      "responsable", this.form.get('responsable')?.value,
      "tel", this.form.get('tel')?.value,).subscribe((data) => {
      this.dataSource.data = data as table[];
      this.locals = data;
      this.locals = this.locals.sort((a:any, b:any) => a.id_Local > b.id_Local ? -1 : 1);
      this.dataSource.data = data as table[];
 
      this.locals.paginator = this.paginator;

    });
  }
}


export class table {
  categorie_Local: string;
  id_Local: string;
  nom_Local: string;
  adresse :string;
  email: string;
  tel: string;
  responsable: string;
  nature_Contrat: string;
  
}
 