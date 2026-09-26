class RecruitmentPage {
  // Elements
  elements = {
    sidebarRecruitmentMenu: () =>
      cy.get(".oxd-main-menu-item").contains("Recruitment"),
    pageTitle: () => cy.get(".oxd-topbar-body-nav-tab-item"),
    addButton: () => cy.contains("button", "Add"),
    tableHeaderCells: () => cy.get(".oxd-table-header-cell"),
    tableRows: () => cy.get(".oxd-table-card"),
    firstTableRow: () => cy.get(".oxd-table-card").first(),
    eyeButton: () => cy.get("(//button[@type='button'])[6]"),

    // Form Add Candidate
    firstNameInput: () => cy.get('input[name="firstName"]'),
    lastNameInput: () => cy.get('input[name="lastName"]'),
    emailInput: () =>
      cy.get(
        "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)",
      ),
    contactNumberInput: () =>
      cy.get(
        'input[placeholder="Contact Number"], input[name="contactNumber"]',
      ),
    keywordsInput: () => cy.get('input[placeholder="Keywords"]'),
    vacancyDropdown: () => cy.get(".oxd-select-text").first(),
    dropdownOptionList: () => cy.get(".oxd-select-dropdown .oxd-select-option"),
    saveButton: () => cy.get("button[type='submit']").contains("Save"),
    requiredFieldError: () =>
      cy.get(".oxd-input-group .oxd-input-field-error-message"),
    successToast: () =>
      cy.get(".oxd-toast-content--success, .oxd-text--toast-message"),

    // Search / Filter
    candidateNameInput: () => cy.get("input[placeholder='Type for hints...']"),
    autocompleteOption: () => cy.get(".oxd-autocomplete-option"),
    statusDropdown: () =>
      cy.contains(".oxd-input-group", "Status").find(".oxd-select-text"),
    searchButton: () => cy.contains("button", "Search"),
    resetButton: () => cy.contains("button", "Reset"),
  };

  // Intercepts
  interceptCandidateList() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as(
      "candidateList",
    );
  }

  interceptCandidateSearch() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as(
      "candidateSearch",
    );
  }

  interceptSaveCandidate() {
    cy.intercept("POST", "**/api/v2/recruitment/candidates*").as(
      "saveCandidate",
    );
  }

  interceptVacancyList() {
    cy.intercept("GET", "**/api/v2/recruitment/vacancies**").as("vacancyList");
  }

  interceptCandidateDetail() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates/**").as(
      "candidateDetail",
    );
  }

  // Actions
  goToRecruitment() {
    this.elements.sidebarRecruitmentMenu().click();
    return this;
  }

  clickAdd() {
    this.elements.addButton().click();
    return this;
  }

  fillCandidateForm({ firstName, lastName, email, vacancy }) {
    if (firstName) this.elements.firstNameInput().clear().type(firstName);
    if (lastName) this.elements.lastNameInput().clear().type(lastName);
    if (email) this.elements.emailInput().clear().type(email);
    if (vacancy) {
      this.elements.vacancyDropdown().click();
      this.elements.dropdownOptionList().contains(vacancy).click();
    }
    return this;
  }

  clickSave() {
    this.elements.saveButton().click();
    return this;
  }

  addCandidate(candidateData) {
    this.clickAdd();
    this.fillCandidateForm(candidateData);
    this.clickSave();
    return this;
  }

  searchByCandidateName(name) {
    this.elements.candidateNameInput().clear().type(name);
    cy.wait(5000); // debounce autocomplete
    cy.get("body").then(($body) => {
      if ($body.find(".oxd-autocomplete-option").length) {
        this.elements.autocompleteOption().first().click();
      }
    });
    this.elements.searchButton().click();
    return this;
  }

  filterByStatus(status) {
    this.elements.statusDropdown().click();
    this.elements.dropdownOptionList().contains(status).click();
    this.elements.searchButton().click();
    return this;
  }

  clickReset() {
    this.elements.resetButton().click();
    return this;
  }

  clickFirstCandidateRow() {
    this.elements.firstTableRow().find("button").first().click();
    return this;
  }

  //  Assertions
  assertOnCandidatesPage() {
    cy.url().should("include", "/recruitment/viewCandidates");
    this.elements
      .pageTitle()
      .should("be.visible")
      .and("contain.text", "Candidates");
    return this;
  }

  assertCandidateListNotEmpty() {
    this.elements.tableRows().should("have.length.greaterThan", 0);
    return this;
  }

  assertTableColumnsVisible() {
    this.elements.tableHeaderCells().should("contain.text", "Candidate");
    this.elements.tableHeaderCells().should("contain.text", "Vacancy");
    this.elements.tableHeaderCells().should("contain.text", "Status");
    return this;
  }

  assertCandidateSavedSuccessfully() {
    this.elements
      .successToast()
      .should("be.visible")
      .and("contain.text", "Successfully Saved");
    return this;
  }

  assertFirstNameRequiredError() {
    this.elements
      .requiredFieldError()
      .first()
      .should("be.visible")
      .and("contain.text", "Required");
    return this;
  }

  assertSearchResultContainsName(name) {
    this.elements.tableRows().should("have.length.greaterThan", 0);
    this.elements.tableRows().each(($row) => {
      cy.wrap($row).invoke("text").should("match", new RegExp(name, "i"));
    });
    // this.elements
    //   .tableRows()
    //   .find(".oxd-table-cell:nth-child(3)")
    //   .should("contain.text", name);

    return this;
  }

  assertSearchResultNotEmpty() {
    this.elements.tableRows().should("have.length.greaterThan", 0);
    return this;
  }

  assertRedirectedToCandidateDetail() {
    cy.url().should("include", "/recruitment/addCandidate");
    return this;
  }
}

export default new RecruitmentPage();
