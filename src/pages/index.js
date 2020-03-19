import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import PropTypes from 'prop-types'
// import fs from 'fs'

// Components
import Layout from '../components/layout'
import SEO from '../components/seo'
import Container from '../components/container'

// Styles
import './index.scss'

const IndexPage = ({ data }) => {
  const projects = data.projects.edges
  const exhibitions = data.exhibitions.edges

  async function shareEvent (url, title, text) {
    try {
      await navigator.share({
        url: url,
        title: title,
        text: text
      })
      console.log('Successfully shared event')
    } catch (err) {
      console.log(`Error: ${err}`)
    }
  }

  return (<Layout>
    <SEO title="Home" />
    <div className="hero">
      <div className="hero__image">
        <Img fluid={data.heroImage.childImageSharp.fluid} />
      </div>
    </div>
    <Container>
      <div className="intro">
        <div className="intro__about">
          <h1 className="intro__headline">This is me</h1>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
          <p> At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
        </div>
        <Img className="intro__image" fluid={data.myImage.childImageSharp.fluid} />
        {/* <div className="intro__quote">
          <blockquote>
            <p>You don&apos;t have to be great to start, but you have to start to be great.</p>
          </blockquote>
        </div> */}
      </div>
    </Container>
    <Container>
      <h2 className="container__headline">Gallerie</h2>
      <div className="projects">
        {projects.map(({ node }) => {
          return (
            <Link to={node.fields.slug} key={node.id} className="project">
              <Img className="project__image" fluid={node.frontmatter.coverImage.childImageSharp.fluid} />
              <div className="project__info-container">
                <div className="project__info">
                  <h2 className="project__headline">{node.frontmatter.title}</h2>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Container>
    <Container>
      <h2 className="container__headline">Ausstellungen</h2>
      <div className="exhibitions">
        {exhibitions.map(({ node }) => {
          return (
            <div className="exhibition" key={node.id}>
              <div className="exhibition__info">
                <div className="exhibition__tag">{node.frontmatter.dateText}</div>
                <div className="exhibition__tag">{node.frontmatter.location}</div>
                <div className="exhibition__tag">{node.frontmatter.price}</div>
              </div>
              <div className="exhibition__content">
                <h3 className="exhibition__headline">{node.frontmatter.title}</h3>
                <p className="exhibition__desc">{node.frontmatter.description}</p>
              </div>
              <div className="exhibition__checkout">
                <div className="exhibition__btn" onClick={shareEvent('https://bk-art.de', node.frontmatter.title, `Kunstausstellung von Bärbel Köller | ${node.frontmatter.dateText} | ${node.frontmatter.location}`)}>Teilen</div>
                {/* <div className="exhibition__btn">Zum Kalender hinzufügen</div> */}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
    <Container styleModifier={['dark-theme']}>
      <h2 className="container__headline container__headline--light">Kontakt</h2>
      <div className="contact">
        <p className="contact__desc p p--light">Hallo! Für allgemeine Anfragen schick eine Email an <a href="mailto:hallo@bk-art.de">hallo@bk-art.de</a>. Wenn du Interesse an einem Kauf der Bilder hast, schicke eine <a href={`mailto:hallo@bk-art.de?subject=Kaufanfrage - ${new Date().toISOString()}`}>Kaufanfrage</a>.</p>
      </div>
    </Container>
  </Layout>)
}

export const pageQuery = graphql`
  query indexPage {
    projects: allMarkdownRemark(      
      filter: {fileAbsolutePath: {regex: "/(\/content\/projects)/.*\\.md$/"}}
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            coverImage {
              childImageSharp {
                  fluid(maxWidth: 800) {
                    ...GatsbyImageSharpFluid
                  }
              }
            }
          }
        }
      }
    }
    exhibitions: allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/(\/content\/exhibitions)/.*\\.md$/"}}
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            description
            dateText
            location
            price
          }
        }
      }
    }
    heroImage: file(relativePath: { eq: "painting-1.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    myImage: file(relativePath: { eq: "me.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

IndexPage.propTypes = {
  data: PropTypes.object
}

export default IndexPage
