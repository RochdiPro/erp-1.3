import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeServiceService } from 'src/app/rh/employe/Service/employe-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {

  id: any
  liste: any = [];
  emp: any;
  constructor(private service: EmployeServiceService, private route: ActivatedRoute, private router: Router) {

  }
  connecter(id: any, pwd: any, socite: any) { 
    this.service.connexion(id, pwd).subscribe((data) => {
      this.emp = data
      if (this.emp == null) {
        Swal.fire(
          'error ',
          'merci de vérifier les données de votre compte ',
          'error'
        )
      }
      else {
        sessionStorage.setItem('Utilisateur', '' + this.emp.nom);
        // sessionStorage.setItem('Acces', this.emp.acces);
        sessionStorage.setItem('Acces',       "1444444"    );     
        this.router.navigate([ 'Menu/Menu-RH/Menu-employee/Visualiser-employee/'+this.emp.id_Employe ]);
      }
    })

  }

}