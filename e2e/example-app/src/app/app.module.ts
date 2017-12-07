import { ApplicationRef, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { createInputTransfer, createNewHosts, removeNgStyles } from "@angularclass/hmr";
import { IonicApp, IonicModule } from "ionic-angular";

import { AppComponent } from "./app.component";

@NgModule({
    imports: [BrowserModule, IonicModule.forRoot(AppComponent)],
    declarations: [AppComponent],
    bootstrap: [IonicApp],
    entryComponents: [AppComponent]
})
export class AppModule {

    constructor(public appRef: ApplicationRef) {
    }

    hmrOnInit(store) {
        if (!store || !store.state) return;
        // inject AppStore here and update it
        // this.AppStore.update(store.state)
        if ('restoreInputValues' in store) {
            store.restoreInputValues();
        }
        // change detection
        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }
    hmrOnDestroy(store) {
        var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation)
        // inject your AppStore and grab state then set it on store
        store.state = { data: 'something' };
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }
    hmrAfterDestroy(store) {
        // display new elements
        store.disposeOldHosts()
        delete store.disposeOldHosts;
        console.clear();
    }

}