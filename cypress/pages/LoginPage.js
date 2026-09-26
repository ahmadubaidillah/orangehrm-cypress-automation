class LoginPage {
  // Element
  element = {
    logo: () => cy.get(".orangehrm-login-branding img"),

    formTitle: () => cy.get(".orangehrm-login-title"),
    usernameInput: () => cy.get('input[name="username"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    loginButton: () => cy.get('button[type="submit"]'),
    forgotPasswordLink: () =>
      cy.contains(".orangehrm-login-forgot-header", "Forgot your password?"),
    errorAlert: () =>
      cy.get(".oxd-alert-content--error .oxd-alert-content-text"),
    requiredFieldError: () =>
      cy.get(".oxd-input-group .oxd-input-field-error-message"),
    dashboardBreadcrumb: () => cy.get(".oxd-topbar-header-breadcrumb h6"),
    resetPasswordTitle: () =>
      cy.get(".oxd-text.oxd-text--h6.orangehrm-forgot-password-title"),
  };

  // Intercept
  interceptLoginRequest() {
    cy.intercept("GET", "**/auth/login").as("loginRequest");
  }

  interceptValidationRequest() {
    cy.intercept("POST", "**/auth/validate").as("validateRequest");
  }

  interceptDashboardData() {
    cy.intercept("GET", "**/dashboard/index").as("dashboardData");
  }

  interceptForgotPasswordPage() {
    cy.intercept("GET", "**/auth/requestPasswordResetCode").as(
      "forgotPasswordPage",
    );
  }

  // Actions
  visit() {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
    return this;
  }

  typeUsername(username) {
    this.element.usernameInput().clear();
    if (username) this.element.usernameInput().type(username);
    return this;
  }

  typePassword(password) {
    this.element.passwordInput().clear();
    if (password) this.element.passwordInput().type(password);
    return this;
  }

  clickLoginButton() {
    this.element.loginButton().click();
    return this;
  }

  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLoginButton();
    return this;
  }

  clickForgotPassword() {
    this.element.forgotPasswordLink().click();
    return this;
  }

  // Assertions
  assertLogoVisible() {
    this.element.logo().should("be.visible");
    return this;
  }

  assertFormTitleVisible(text = "Login") {
    this.element.formTitle().should("be.visible").and("contain.text", text);
    return this;
  }

  assertUsernameInputVisible() {
    this.element.usernameInput().should("be.visible");
    return this;
  }

  assertPasswordInputVisible() {
    this.element.passwordInput().should("be.visible");
    return this;
  }

  assertLoginButtonVisible() {
    this.element
      .loginButton()
      .should("be.visible")
      .and("contain.text", "Login");
    return this;
  }

  assertLoginSuccess() {
    cy.url().should("include", "/dashboard/index");
    this.element
      .dashboardBreadcrumb()
      .should("be.visible")
      .and("contain.text", "Dashboard");
    return this;
  }

  assertInvalidCredentialsError() {
    this.element
      .errorAlert()
      .should("be.visible")
      .and("contain.text", "Invalid credentials");
    this.assertStillOnLoginPage();
    return this;
  }

  assertRequiredErrorCount(count) {
    this.element
      .requiredFieldError()
      .should("have.length", count)
      .each((data) => {
        cy.wrap(data).should("contain.text", "Required");
      });
    this.assertStillOnLoginPage();
    return this;
  }

  assertStillOnLoginPage() {
    cy.url().should("include", "/auth/login");
    return this;
  }

  assertRedirectedToResetPassword() {
    cy.url().should("include", "requestPasswordResetCode");
    this.element
      .resetPasswordTitle()
      .should("be.visible")
      .and("contain.text", "Reset Password");
    return this;
  }
}

export default new LoginPage();
