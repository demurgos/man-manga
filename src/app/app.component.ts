import {Component, Inject} from "@angular/core";
import {appEnvironment, Environment} from "./app.tokens";

@Component({
  selector: "mmg-app",
  moduleId: "app.component",
  templateUrl: "app.component.html",
  styleUrls: [
    "app.component.css"
  ]
})
export class AppComponent {
  private environment: Environment;

  constructor(@Inject(appEnvironment) environment: Environment) {
    this.environment = environment;
    console.log("Environment:");
    console.log(this.environment);
  }
}
