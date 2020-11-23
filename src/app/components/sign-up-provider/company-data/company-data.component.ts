import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-data',
  templateUrl: './company-data.component.html',
  styleUrls: ['./company-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanyDataComponent implements OnInit {

  companyForm: FormGroup;

  constructor(private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createForms();
  }

  nextPage(){
    this.router.navigate(['/'])
  }

  createForms(){
    this.companyForm = this.fb.group({
      nombre: ['',[ Validators.required]],
      address: ['', [Validators.required]],
      nif: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      seguridad: ['',[ Validators.required]],
      iae: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }
}
