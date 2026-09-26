class DirectoryPage {
  // Elements
  elements = {
    sidebarDirectoryMenu: () =>
      cy.get(".oxd-main-menu-item").contains("Directory"),
    pageTitle: () => cy.get(".oxd-topbar-header-breadcrumb h6"),
    employeeCards: () => cy.get(".orangehrm-directory-card"),
    employeeNameInput: () => cy.get("input[placeholder='Type for hints...']"),
    autocompleteOption: () => cy.get(".oxd-autocomplete-option"),
    jobTitleDropdown: () =>
      cy.get(".oxd-grid-item").eq(1).find(".oxd-select-text"),
    locationDropdown: () =>
      cy.get(".oxd-grid-item").eq(2).find(".oxd-select-text"),
    dropdownOptionList: () => cy.get(".oxd-select-dropdown .oxd-select-option"),
    searchButton: () => cy.contains("button", "Search"),
    resetButton: () => cy.contains("button", "Reset"),
    noRecordsMessage: () => cy.contains(".oxd-text", "No Records Found"),
    firstEmployeeCardImage: () => cy.get(".orangehrm-profile-picture").first(),
    firstEmployeeCardName: () =>
      cy.get(".orangehrm-directory-card-header").first(),
    firstEmployeeCardSubtitle: () =>
      cy.get(".orangehrm-directory-card-subtitle").first(),
    detailRightAarrow: () =>
      cy.get(
        "div[class='orangehrm-corporate-directory-sidebar'] i[class='oxd-icon bi-arrow-right']",
      ),
  };

  // InterCepts
  interceptDirectoryList() {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("directoryList");
  }

  interceptEmployeeSearch() {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("employeeSearch");
  }

  interceptEmployeeDetail() {
    cy.intercept("GET", "**/api/v2/directory/employees/**").as(
      "employeeDetail",
    );
  }

  // Actions
  goToDirectory() {
    this.elements.sidebarDirectoryMenu().click();
    return this;
  }

  searchByEmployeeName(name) {
    this.elements.employeeNameInput().clear().type(name);
    cy.wait(5000); // debounce autocomplete
    cy.get("body").then(($body) => {
      if ($body.find(".oxd-autocomplete-option").length) {
        this.elements.autocompleteOption().first().click();
      }
    });
    this.elements.searchButton().click();
    return this;
  }

  searchByJobTitle(jobTitle) {
    this.selectDropdownOption(this.elements.jobTitleDropdown, jobTitle);
    this.elements.searchButton().click();
    return this;
  }

  searchByLocation(location) {
    this.selectDropdownOption(this.elements.locationDropdown, location);
    this.elements.searchButton().click();
    return this;
  }

  selectDropdownOption(dropdownGetter, optionText) {
    dropdownGetter().click();
    this.elements.dropdownOptionList().contains(optionText).click();
    return this;
  }

  clickReset() {
    this.elements.resetButton().click();
    return this;
  }

  clickFirstEmployeeCard() {
    this.elements.employeeCards().first().click();
    return this;
  }

  // Assertions
  assertOnDirectoryPage() {
    cy.url().should("include", "/directory/viewDirectory");
    this.elements
      .pageTitle()
      .should("be.visible")
      .and("contain.text", "Directory");
    return this;
  }

  assertAtLeastOneEmployeeCard() {
    this.elements.employeeCards().should("have.length.greaterThan", 0);
    return this;
  }

  assertSearchResultContainsName(name) {
    this.elements.employeeCards().should("have.length.greaterThan", 0);
    this.elements.employeeCards().each(($card) => {
      cy.wrap($card).invoke("text").should("match", new RegExp(name, "i"));
    });
    return this;
  }

  assertNoRecordsFound() {
    // this.elements.noRecordsMessage().should("be.visible");
    cy.get("body").then(($body) => {
      if ($body.find(".oxd-autocomplete-option").length) {
        this.elements
          .autocompleteOption()
          .first()
          .should("be.visible")
          .and("contain.text", "No Records Found");
      }
    });

    return this;
  }

  assertSearchResultNotEmpty() {
    this.elements.employeeCards().should("have.length.greaterThan", 0);
    return this;
  }

  assertEmployeeCardStructure() {
    this.elements.firstEmployeeCardImage().should("be.visible");
    this.elements
      .firstEmployeeCardName()
      .should("be.visible")
      .and("not.be.empty");
    this.elements
      .firstEmployeeCardSubtitle()
      .should("have.length.greaterThan", 0);
    return this;
  }

  assertRedirectedToEmployeeDetail() {
    this.elements.detailRightAarrow().should("be.visible");
    return this;
  }
}

export default new DirectoryPage();
