import {FormControl} from '@angular/forms';
import {QueryService} from './../query/query.service';
import {AfterViewInit, Component, HostListener, NgModule, OnInit} from '@angular/core';
import {Settings} from "../settings.model";
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LoginRequest, UserService} from "../../../openapi/dres";
import {DresService} from "../query/dres.service";
import * as zlib from "zlib";


@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit{

    constructor(private userService: UserService, private dresService: DresService) {
        this.loginState = localStorage.getItem('dresLogin') == 'true'
        if (localStorage.getItem('schema')) {
            this.selectedSchema = localStorage.getItem('schema') as string;
        }else {
            this.selectedSchema = Settings.schemas[0];
        }
        this.selectedEvalId = "";
        this.evalIds = this.dresService.getEvaluationIds();
    }
    ngOnInit(): void{
        console.log("Loading Siebar");
    }

    protected  loginState : Boolean = false;
    public schemas: string[] = Settings.schemas;
    public selectedSchema: string;
    public selectedEvalId: string;

    public evalIds: string[] = [];

    public showSidebarPane = false;

    public toggleSidebarPane() {
        this.showSidebarPane = !this.showSidebarPane;
    }

    tryLogout(){
        this.dresService.logout();
        this.loginState = localStorage.getItem('dresLogin') == 'true'
    }


    tryLogin(username: string, password: string){

        this.dresService.login(username, password);
        this.loginState = localStorage.getItem('dresLogin') == 'true'
        this.ngOnInit();
    }

    trySaveId(id: string){
        localStorage.setItem('evaluationId', id);
    }
    eventSchemaChange(change: string, $event: any) {
        console.log($event);
        this.selectedSchema = $event.value
        localStorage.setItem('schema', this.selectedSchema);
    }

    eventEvalIdChange(change: string, $event: any) {
        this.evalIds = this.dresService.getEvaluationIds();
        console.log($event);
        this.selectedEvalId = $event.value
    }
}
