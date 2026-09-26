import LoginPage from "../pages/LoginPage";
import RecruitmentPage from "../pages/RecruitmentPage";

describe("Fitur Recruitment - OrangeHRM Demo", () => {
  let users;
  let candidateData;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
    cy.fixture("candidates").then((data) => {
      candidateData = data;
    });
  });

  beforeEach(() => {
    // Precondition: user sudah login sebagai Admin dan berada di Dashboard
    LoginPage.visit();
    LoginPage.interceptValidationRequest();
    LoginPage.login(users.validUser.username, users.validUser.password);
    cy.wait("@validateRequest");
    LoginPage.assertLoginSuccess();

    RecruitmentPage.interceptCandidateList();
  });

  it("TC_REC_01 - Navigasi ke menu Recruitment menampilkan halaman Candidates", () => {
    RecruitmentPage.goToRecruitment();
    cy.wait("@candidateList").its("response.statusCode").should("eq", 200);

    RecruitmentPage.assertOnCandidatesPage();
    RecruitmentPage.assertCandidateListNotEmpty();
  });

  it("TC_REC_02 - Tabel Candidates menampilkan kolom-kolom yang sesuai", () => {
    RecruitmentPage.goToRecruitment();
    cy.wait("@candidateList");

    RecruitmentPage.assertTableColumnsVisible();
  });

  it("TC_REC_03 - Menambahkan candidate baru dengan data lengkap & valid berhasil tersimpan", () => {
    RecruitmentPage.goToRecruitment();
    cy.wait("@candidateList");

    RecruitmentPage.interceptVacancyList();
    RecruitmentPage.clickAdd();
    cy.wait("@vacancyList");

    RecruitmentPage.interceptSaveCandidate();
    RecruitmentPage.fillCandidateForm(candidateData.validCandidate);
    RecruitmentPage.elements.saveButton().should("be.visible");

    RecruitmentPage.clickSave();

    cy.wait("@saveCandidate").its("response.statusCode").should("eq", 200);
    RecruitmentPage.assertCandidateSavedSuccessfully();
  });

  it("TC_REC_04 - Menambahkan candidate tanpa First Name menampilkan validasi Required", () => {
    RecruitmentPage.goToRecruitment();
    cy.wait("@candidateList");

    RecruitmentPage.clickAdd();
    RecruitmentPage.fillCandidateForm(candidateData.candidateWithoutFirstName);
    RecruitmentPage.clickSave();

    RecruitmentPage.assertFirstNameRequiredError();
  });

  it("TC_REC_05 - Pencarian candidate berdasarkan nama menampilkan hasil sesuai", () => {
    RecruitmentPage.goToRecruitment();
    cy.wait("@candidateList");

    RecruitmentPage.interceptCandidateSearch();
    RecruitmentPage.searchByCandidateName(
      candidateData.searchByName.candidateName,
    );
    cy.wait("@candidateSearch").its("response.statusCode").should("eq", 200);

    RecruitmentPage.assertSearchResultContainsName(
      candidateData.searchByName.candidateName,
    );
  });

  it("TC_REC_06 - Filter candidate berdasarkan Status menampilkan hasil sesuai", () => {
    RecruitmentPage.goToRecruitment();
    cy.wait("@candidateList");

    RecruitmentPage.interceptCandidateSearch();
    RecruitmentPage.filterByStatus(candidateData.filterByStatus.status);
    cy.wait("@candidateSearch").its("response.statusCode").should("eq", 200);

    RecruitmentPage.assertSearchResultNotEmpty();
  });

  it("TC_REC_07 - Tombol Reset mengembalikan seluruh data candidate", () => {
    RecruitmentPage.goToRecruitment();

    cy.wait("@candidateList");

    RecruitmentPage.interceptCandidateSearch();

    RecruitmentPage.interceptCandidateSearch();
    RecruitmentPage.searchByCandidateName(
      candidateData.searchByName.candidateName,
    );
    cy.wait("@candidateSearch").its("response.statusCode").should("eq", 200);

    // RecruitmentPage.interceptCandidateList();

    RecruitmentPage.clickReset();

    cy.wait("@candidateList").its("response.statusCode").should("eq", 200);

    RecruitmentPage.assertCandidateListNotEmpty();
  });

  it("TC_REC_08 - Klik eye button pada list candidate menampilkan halaman detail candidate", () => {
    RecruitmentPage.goToRecruitment();
    cy.wait("@candidateList");

    RecruitmentPage.interceptCandidateDetail();
    RecruitmentPage.clickFirstCandidateRow();
    cy.wait("@candidateDetail").its("response.statusCode").should("eq", 200);

    RecruitmentPage.assertRedirectedToCandidateDetail();
  });
});
