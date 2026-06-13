describe('CodingDojo critical learning flows', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('loads the dashboard learning priorities', () => {
    cy.visit('/');

    cy.contains('Heute lernen').should('be.visible');
    cy.contains('Dein nächster sinnvoller Schritt').should('be.visible');
    cy.contains('Tagesziele').should('be.visible');
    cy.contains('Lernpfade').should('be.visible');
  });

  it('keeps the mobile app shell within the viewport', () => {
    cy.viewport('iphone-6');
    cy.visit('/');

    cy.contains('Start').should('be.visible');
    cy.contains('Kurse').should('be.visible');
    cy.window().then((window) => {
      const { documentElement } = window.document;
      expect(documentElement.scrollWidth).to.be.at.most(documentElement.clientWidth);
    });
  });

  it('runs a SQL sandbox query inside the project IDE', () => {
    cy.visit('/projects');

    cy.contains('article', 'Progress Database Schema')
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'IDE öffnen').click();
      });

    cy.contains('queries.sql').should('be.visible');
    cy.contains('Lokale Testdatenbank').should('be.visible');
    cy.contains('button', 'Query ausführen').click();

    cy.contains('Ergebnis').should('be.visible');
    cy.contains('2 Zeilen').should('be.visible');
    cy.contains('sql-joins').should('be.visible');
    cy.contains('sql-select').should('be.visible');
  });
});
