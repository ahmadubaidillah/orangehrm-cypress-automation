import LoginPage from "../pages/LoginPage";
import users from "../fixtures/users.json";

describe("Fitur Login - OrangeHrm Demo", () => {
  beforeEach(() => {
    LoginPage.interceptLoginRequest();
    LoginPage.interceptDashboardData();
    LoginPage.interceptForgotPasswordPage();
    LoginPage.interceptValidationRequest();

    LoginPage.visit();
  });

  it("TC_LOGIN_01 - Verifikasi elemen halaman Login tampil lengkap", () => {
    LoginPage.assertLogoVisible()
      .assertFormTitleVisible("Login")
      .assertUsernameInputVisible()
      .assertPasswordInputVisible()
      .assertLoginButtonVisible();
  });

  it("TC_LOGIN_02 - Login berhasil dengan username & password valid ", () => {
    LoginPage.login(users.validUser.username, users.validUser.password);

    cy.wait("@validateRequest").its("response.statusCode").should("eq", 302);
    cy.wait("@dashboardData").its("response.statusCode").should("eq", 200);

    LoginPage.assertLoginSuccess();
  });

  it("TC_LOGIN_03 - Login gagal dengan password salah", () => {
    LoginPage.login(users.wrongPassword.username, users.wrongPassword.password);

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    LoginPage.assertInvalidCredentialsError();
  });

  it("TC_LOGIN_04 - Login gagal dengan username salah", () => {
    LoginPage.login(users.wrongUsername.username, users.wrongUsername.password);

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    LoginPage.assertInvalidCredentialsError();
  });

  it("TC_LOGIN_05 - Login gagal saat username & password dikosongkan", () => {
    LoginPage.login(
      users.emptyUsernameAndPassword.username,
      users.emptyUsernameAndPassword.password,
    );

    LoginPage.assertRequiredErrorCount(2);
  });

  it("TC_LOGIN_06 - Login gagal saat hanya username yang dikosongkan", () => {
    LoginPage.login(
      users.emptyUsernameOnly.username,
      users.emptyUsernameOnly.password,
    );

    LoginPage.assertRequiredErrorCount(1);
  });

  it("TC_LOGIN_07 - Login gagal saat hanya password yang dikosongkan", () => {
    LoginPage.login(
      users.emptyPasswordOnly.username,
      users.emptyPasswordOnly.password,
    );

    LoginPage.assertRequiredErrorCount(1);
  });

  it("TC_LOGIN_08 - Klik 'Forgot your password?' mengarahkan ke halaman Reset Password", () => {
    LoginPage.clickForgotPassword();

    cy.wait("@forgotPasswordPage").its("response.statusCode").should("eq", 200);
    LoginPage.assertRedirectedToResetPassword();
  });
});
