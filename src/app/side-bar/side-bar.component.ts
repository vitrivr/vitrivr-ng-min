import {FormControl} from '@angular/forms';
import {QueryService} from './../query/query.service';
import {Component, HostListener, NgModule} from '@angular/core';
import {Settings} from "../settings.model";
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LoginRequest, UserService} from "../../../openapi/dres";
import {DresService} from "../query/dres.service";


@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {

    constructor(private userService: UserService, private dresService: DresService) {

        if (localStorage.getItem('schema')) {
            this.selectedSchema = localStorage.getItem('schema') as string;
        }else {
            this.selectedSchema = Settings.schemas[0];
        }
    }

    public schemas: string[] = Settings.schemas;
    public selectedSchema: string;

    public showSidebarPane = false;

    public toggleSidebarPane() {
        this.showSidebarPane = !this.showSidebarPane;
    }


    tryLogin(username: string, password: string){
        localStorage.setItem('dresUser', username);
        localStorage.setItem('dresPassword', password);

        this.dresService.login(username, password);
    }

    eventSchemaChange(change: string, $event: any) {
        console.log($event);
        this.selectedSchema = $event.value
        localStorage.setItem('schema', this.selectedSchema);
    }
}
