describe('Blog app', function() {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testuser',
      username: 'test',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
      cy.contains('Testuser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('wrongPassword')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test', password: 'test' })
    })

    it('a blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('a blog created by cypress')
      cy.get('#author-input').type('cypress')
      cy.get('#url-input').type('localhost/cypress')
      cy.get('#create-button').click()
      cy.contains('a blog created by cypress cypress')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Testblog', author: 'cypress', url: 'testurl' })
      })

      it('a like can be added', function() {
        cy.contains('Testblog').parent().find('button').as('viewButton')
        cy.get('@viewButton').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('a blog can be deleted by the owner', function() {
        cy.contains('Testblog').parent().find('button').as('viewButton')
        cy.get('@viewButton').click()
        cy.contains('remove').click()
        cy.contains('Testblog').should('not.exist')
      })

      it.only('the blogs are ordered descending according to likes', function() {
        cy.createBlog({ title: 'The title with the second most likes', author: 'cypress', url: 'testurl' })
        cy.createBlog({ title: 'The title with the most likes', author: 'cypress', url: 'testurl' })
        cy.contains('The title with the most likes').parent().find('button').as('viewButton1')
        cy.get('@viewButton1').click()
        cy.contains('The title with the most likes').parent().find('button').contains('like').click().click()
        cy.contains('The title with the second most likes').parent().find('button').as('viewButton2')
        cy.get('@viewButton2').click()
        cy.contains('The title with the second most likes').parent().find('button').contains('like').click()
        cy.contains('likes 1')
        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
      })
    })
  })
})