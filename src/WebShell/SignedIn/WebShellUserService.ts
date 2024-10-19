import { WebShellUserContext } from "../SignedInStateTracking/WebShellUserContext";

export default class WebShellUserService {
  static context = WebShellUserContext;

  static getUser(context: React.ContextType<typeof WebShellUserContext>) {
    this.throwErrorIfContextMissing(context);
    return context!.user;
  }

  static logout(context: React.ContextType<typeof WebShellUserContext>) {
    this.throwErrorIfContextMissing(context);
    context!.logout();
  }

  static throwErrorIfContextMissing(
    context: React.ContextType<typeof WebShellUserContext>
  ) {
    if (!context) {
      throw new Error("WebShellUserContext not found");
    }
  }
}
