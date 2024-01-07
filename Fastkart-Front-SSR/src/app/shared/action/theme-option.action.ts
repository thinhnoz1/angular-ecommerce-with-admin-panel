export class GetThemeOption {
   static readonly type = "[Theme Option] Get";
}

export class UpdateSession {
   static readonly type = "[Theme Option] Update Session";
   constructor(public slug: string, public value: boolean) {}
}