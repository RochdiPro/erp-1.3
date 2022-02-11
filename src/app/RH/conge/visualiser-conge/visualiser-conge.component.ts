 
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CongeServiceService } from '../conge-service.service';
 
@Component({
  selector: 'app-visualiser-conge',
  templateUrl: './visualiser-conge.component.html',
  styleUrls: ['./visualiser-conge.component.scss']
})
export class VisualiserCongeComponent   {

  employe: any;
  id_emp: number
  constructor(private datePipe: DatePipe, public dialog: MatDialog, private serviceEmploye: CongeServiceService, private fb: FormBuilder,  private route: ActivatedRoute, private router: Router) {
     
      
    this.id_emp = this.route.snapshot.params.id ;     
    this.serviceEmploye.Employe(this.id_emp).subscribe((resp: any) => {
      this.employe = resp;      
      
    });
  }

  changer_etat ( etat : any)
  {
    var formData: any = new FormData();
    formData.append('Id', this.id_emp);
    formData.append('Etat', etat);
    this.serviceEmploye.Changer_Etat(formData).subscribe((resp: any) => {
      this.employe = resp;     
      this.router.navigate(['/Menu/Menu-conge/Lister-conge'])
      
    });

    
  }

}



