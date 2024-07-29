interface AuthUserState {
  state: {
    authUser: boolean;
  };
}

class Auth {
  private authenticated: boolean;

  constructor() {
    this.authenticated = false;
  }

  login(cb: () => void): void {
    this.authenticated = true;
    cb();
  }

  logout(cb: () => void): void {
    this.authenticated = false;
    cb();
  }

  isAuthenticated(): boolean {
    const isLogData = localStorage.getItem("z");

    if (isLogData) {
      try {
        const parsedData: AuthUserState = JSON.parse(isLogData);
        this.authenticated = parsedData.state.authUser;
      } catch (error) {
        console.error("Failed to parse authentication data:", error);
        this.authenticated = false;
      }
    } else {
      this.authenticated = false;
    }

    return this.authenticated;
  }
}

export default new Auth();
