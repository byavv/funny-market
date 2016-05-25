import {Component, OnInit} from '@angular/core';
import {Control, ControlGroup} from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {UsersBackEndApi} from "../../services/usersBackEndApi"
import {Api, Identity} from "../../../shared/services";

@Component({
    selector: 'settings',
    template: require('./personal.html'),
    directives: []
})

export class ProfileComponent implements OnInit {
    personalForm: ControlGroup;
    model: any = {};
    error;
    info;
    constructor(private usersBackEnd: UsersBackEndApi, private identity: Identity, private router: Router) {
        this.personalForm = new ControlGroup({
            name: new Control(),
            location: new Control()
        })
    }

    ngOnInit() {
        this.usersBackEnd.getProfileData().subscribe((result) => {
            this.model = result || {};
        }, (err) => {
            err = err.json();
            this.error = err.error.message;
        })
    }

    onSubmit() {
        this.usersBackEnd.setProfileData(this.personalForm.value)
            .subscribe((result) => {
                this.error = null;
                this.info = 'Profile data was updated successfully';
                setTimeout(() => {
                    this.info = null;
                }, 5000)
            }, err => {
                err = err.json()
                this.error = err.error.message;
            })
    }
}