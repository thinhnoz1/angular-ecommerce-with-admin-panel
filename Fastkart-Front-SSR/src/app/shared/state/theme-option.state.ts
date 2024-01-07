import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { ThemeOptionService } from "../services/theme-option.service";
import { GetThemeOption, UpdateSession } from "../action/theme-option.action";
import { Option, ThemeOption } from "../interface/theme-option.interface";

export class ThemeOptionStateModel {
  theme_option: Option | null;
  exit: boolean;
  cookies: boolean;
  newsletter: boolean;
}

@State<ThemeOptionStateModel>({
  name: "theme_option",
  defaults: {
    theme_option: null,
    exit: true,
    cookies: true,
    newsletter: true
  },
})
@Injectable()
export class ThemeOptionState {

  constructor(private themeOptionService: ThemeOptionService) {}

  @Selector()
  static themeOptions(state: ThemeOptionStateModel) {
    return state.theme_option;
  }

  @Selector()
  static exit(state: ThemeOptionStateModel) {
    return state.exit;
  }

  @Selector()
  static cookies(state: ThemeOptionStateModel) {
    return state.cookies;
  }

  @Selector()
  static newsletter(state: ThemeOptionStateModel) {
    return state.newsletter;
  }

  @Action(GetThemeOption)
  getThemeOptions({ getState, setState }: StateContext<ThemeOptionStateModel>) {
    return this.themeOptionService.getThemeOption().pipe(
      tap({
        next: (result: ThemeOption) => {
          const state = getState();
          setState({
            ...state,
            theme_option: result.options,
          });
        },
        error: (err) => {
          throw new Error(err?.error?.message);
        },
      })
    );
  }

  @Action(UpdateSession)
  UpdateSession(ctx: StateContext<ThemeOptionStateModel>, action: UpdateSession) {
    const state = ctx.getState();
    ctx.patchState({
     ...state,
     cookies: action.slug == 'cookies' ? action.value : state.cookies,
     exit: action.slug == 'exit' ? action.value : state.exit,
     newsletter: action.slug == 'newsletter' ? action.value : state.newsletter
    });
  }


}
