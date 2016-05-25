import {Component, Directive, Input, QueryList, AfterContentInit,
  ViewContainerRef, TemplateRef, ContentChildren, ViewRef} from '@angular/core';

@Directive({
  selector: '[ui-pane]'
})
export class UiPane {
  @Input('ui-pane')
  id: string;
  @Input()
  valid: boolean = true;
  visited: boolean = false;
  @Input() title: string;
  private _active: boolean = false;
  cache: ViewRef;
  constructor(public viewContainer: ViewContainerRef,
    public templateRef: TemplateRef<UiTabs>) { }
  @Input() set active(active: boolean) {
    if (active == this._active) return;
    this._active = active;
    // may be one only within  a tab 
    if (active) {
      if (this.cache) {
        this.viewContainer.insert(this.cache);
      } else {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.cache = this.viewContainer.detach(0);
      this.visited = true;
    }
  }
  get active(): boolean {
    return this._active;
  }
}
@Component({
  selector: 'ui-tabs',
  template: `
     <div class="row">
         <div class="col-md-12 col-sm-12 col-lg-12">
              <ol class="my-card my-steps custom-icons">
                  <li *ngFor="let pane of panes" class='{{pane.id}}' 
                      (click)="goTo(pane.id)"
                      role="presentation" 
                      [ngClass] = '{invalid: !pane.valid && pane.visited, current: pane.active, visited: pane.visited}'>
                      <a href=''>{{pane.title}}</a>
                  </li>
             </ol>
         </div>
         <div class="col-md-12 col-sm-12 col-lg-12">
             <ng-content></ng-content>
         </div>
     </div>
    `,
  styles: [require('./header.scss')]
})
export class UiTabs {
  @ContentChildren(UiPane) panes: QueryList<UiPane>;
  goTo(id) {
    this.panes.toArray().forEach((p: UiPane) => p.active = (p.id == id));
  }
  ngAfterViewInit() {
  //  this.goTo(this.panes.toArray()[0].id)
  }
}
