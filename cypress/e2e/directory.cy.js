import LoginPage from "../pages/LoginPage";
import DirectoryPage from "../pages/DirectoryPage";

describe("Fitur Directory - OrangeHRM Demo", () => {
  let users;
  let directoryData;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
    cy.fixture("directory").then((data) => {
      directoryData = data;
    });
  });

  beforeEach(() => {
    // Precondition: user sudah login sebagai Admin dan berada di Dashboard
    LoginPage.visit();
    LoginPage.interceptValidationRequest();
    LoginPage.login(users.validUser.username, users.validUser.password);
    cy.wait("@validateRequest");
    LoginPage.assertLoginSuccess();

    DirectoryPage.interceptDirectoryList();
  });

  it("TC_DIR_01 - Navigasi ke menu Directory menampilkan halaman Directory", () => {
    DirectoryPage.goToDirectory();
    cy.wait("@directoryList").its("response.statusCode").should("eq", 200);

    DirectoryPage.assertOnDirectoryPage();
    DirectoryPage.assertAtLeastOneEmployeeCard();
  });

  it("TC_DIR_02 - Pencarian employee berdasarkan nama valid menampilkan hasil sesuai", () => {
    DirectoryPage.goToDirectory();
    cy.wait("@directoryList");

    DirectoryPage.interceptEmployeeSearch();
    DirectoryPage.searchByEmployeeName(
      directoryData.searchByValidName.employeeName,
    );
    cy.wait("@employeeSearch").its("response.statusCode").should("eq", 200);

    DirectoryPage.assertSearchResultContainsName(
      directoryData.searchByValidName.employeeName,
    );
  });

  it("TC_DIR_03 - Pencarian employee dengan nama tidak ditemukan menampilkan pesan kosong", () => {
    DirectoryPage.goToDirectory();
    cy.wait("@directoryList");

    DirectoryPage.interceptEmployeeSearch();
    DirectoryPage.searchByEmployeeName(
      directoryData.searchByInvalidName.employeeName,
    );
    cy.wait("@employeeSearch").its("response.statusCode").should("eq", 200);

    DirectoryPage.assertNoRecordsFound();
  });

  it("TC_DIR_04 - Pencarian employee berdasarkan Job Title menampilkan hasil sesuai", () => {
    DirectoryPage.goToDirectory();
    cy.wait("@directoryList");

    DirectoryPage.interceptEmployeeSearch();
    DirectoryPage.searchByJobTitle(directoryData.searchByJobTitle.jobTitle);
    cy.wait("@employeeSearch").its("response.statusCode").should("eq", 200);

    DirectoryPage.assertSearchResultNotEmpty();
  });

  it("TC_DIR_05 - Pencarian employee berdasarkan Location menampilkan hasil sesuai", () => {
    DirectoryPage.goToDirectory();
    cy.wait("@directoryList");

    DirectoryPage.interceptEmployeeSearch();
    DirectoryPage.searchByLocation(directoryData.searchByLocation.location);
    cy.wait("@employeeSearch").its("response.statusCode").should("eq", 200);

    DirectoryPage.assertSearchResultNotEmpty();
  });

  it("TC_DIR_06 - Tombol Reset mengembalikan seluruh data directory", () => {
    DirectoryPage.goToDirectory();
    cy.wait("@directoryList");

    DirectoryPage.interceptEmployeeSearch();
    DirectoryPage.searchByEmployeeName(
      directoryData.searchForResetScenario.employeeName,
    );
    cy.wait("@employeeSearch");

    DirectoryPage.interceptDirectoryList();
    DirectoryPage.clickReset();
    cy.wait("@directoryList").its("response.statusCode").should("eq", 200);

    DirectoryPage.assertAtLeastOneEmployeeCard();
  });

  it("TC_DIR_07 - Kartu employee menampilkan struktur foto, nama, dan jabatan", () => {
    DirectoryPage.goToDirectory();
    cy.wait("@directoryList");

    DirectoryPage.assertEmployeeCardStructure();
  });

  it("TC_DIR_08 - Klik kartu employee mengarahkan ke halaman detail employee", () => {
    DirectoryPage.goToDirectory();
    cy.wait("@directoryList");

    DirectoryPage.interceptEmployeeDetail();
    DirectoryPage.clickFirstEmployeeCard();
    cy.wait("@employeeDetail").its("response.statusCode").should("eq", 200);

    DirectoryPage.assertRedirectedToEmployeeDetail();
  });
});
