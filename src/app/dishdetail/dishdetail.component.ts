import { Component, OnInit } from '@angular/core';

import { Params, ActivatedRoute} from '@angular/router';
import { Location} from '@angular/common';
import { FormGroup, FormBuilder, Validators} from '@angular/forms'

import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';

import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds:number[];
  prev : number;
  next: number;
  commentForm:FormGroup;

  formErrors = {
    'rating' : '',
    'comment' : '',
    'author' : '',
    'date' : '',
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
    },
    'comment': {
      'required':      'Comment is required.',
    },
    
  };

  
  constructor(private dishservice : DishService,
    private route : ActivatedRoute,
    private location : Location,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.dishservice.getDishIds()
    .subscribe(dishIds => this.dishIds = dishIds);

    this.route.params
    .switchMap((params : Params)=> this.dishservice.getDish(+params['id']))
    .subscribe(dish => {this.dish = dish; this.setPrevNext(dish.id)});

    this.createForm();
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating:  '5',
      comment:  ['', [Validators.required] ],
      author: ['', [Validators.required, Validators.minLength(2)] ],
      date: new Date().toISOString(),
    });

    this.commentForm.valueChanges
    .subscribe( data => this.onValueChanged(data));
    
    this.onValueChanged()
  }

  onSubmit() {
    this.dish.comments.push(this.commentForm.value);
    console.log(this.commentForm.value)
    this.commentForm.reset({
      rating : '5',
      comment : '',
      author : '',
      date : new Date().toISOString(),
    });
  };

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }



}
 