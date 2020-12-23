import { Directive, ElementRef, HostListener, SimpleChange } from "@angular/core";

@Directive({
    selector:"[loader]",
    inputs:["switch", "hasBackDrop", "backDropColor", "spinnerColors"]
})
export class SioLoaderDirective{
    public host:HTMLElement;
    public switch:boolean = false;
    public hasBackDrop:boolean = true;
    public backDropColor:string="";
    public spinnerColors:spinnerColor={colorA:"#3498db", colorB:"#dbf5ff"};

    constructor(private element:ElementRef){
        this.host=element.nativeElement;
    }

    ngOnChanges(changes: SimpleChange): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if(this.switch){
            this.makeLoader();
        }else{
            this.destroyLoader();
        }
    }

    private makeLoader(){
        let backdrop = "<div class=\"cdk-overlay-backdrop";
        if(this.hasBackDrop){
            backdrop += " cdk-overlay-dark-backdrop "
        }
        backdrop += "cdk-overlay-backdrop-showing\"";
        if(this.backDropColor!="" && this.hasBackDrop){
            backdrop += " Style=\"background-color:" + this.backDropColor + "; opacity:0.288;\"";    
        }
        backdrop += "></div>";

        let wrapperloader = "<div class=\"cdk-global-overlay-wrapper\" dir=\"ltr\" style=\"justify-content: center; align-items: center;\"><div id=\"cdk-overlay-0\" class=\"cdk-overlay-pane\" style=\"max-width: 80vw; pointer-events: auto; width: 250px; position: static;\"><div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\"></div><div style=\"position:absolute; width:50px; height:50px; top:calc(50% - 25px); left:calc(50% - 25px);\"><div id=\"loader\" style=\"border:8px solid "+this.spinnerColors.colorB+"; border-radius:50%; border-top:8px solid "+this.spinnerColors.colorA+"; width:50px; height:50px; -webkit-animation:spin 1s linear infinite; animation: spin 1s linear infinite;\"></div></div></div></div>"
        this.host.insertAdjacentHTML('beforeend', backdrop);
        this.host.insertAdjacentHTML('beforeend', wrapperloader);
    }

    private destroyLoader(){
        if(this.host.querySelector('#loader') != null){
            this.host.removeChild(this.host.lastChild);
            this.host.removeChild(this.host.lastChild);
        }        
    }
}

interface spinnerColor{
    colorA:string,
    colorB:string
}