import React from 'react'
import { graphql, Link } from 'gatsby'
import { GatsbyImage as Img } from 'gatsby-plugin-image'
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
  const indexPage = data.indexPage.edges[0].node.frontmatter

  async function shareEvent (url, title, text) {
    try {
      await navigator.share({
        url: url,
        title: title,
        text: text
      })
      console.log('Successfully shared event')
    } catch (err) {
      window.open(`https://wa.me/?text=${encodeURI(`${title} - ${text} | ${url} `)}`)
      console.error(`WebShare Error: ${err}`)
    }
  }

  return (<Layout>
    <SEO title="Home" />
    <div className="hero">
      <div className="hero__image">
        <Img image={indexPage.coverImage.childImageSharp.gatsbyImageData} alt="Barbara Köller Gemälde" />
      </div>
    </div>
    <Container>
      <div className="intro">
        <div className="intro__about">
          <div dangerouslySetInnerHTML={{ __html: indexPage.intro }}></div>
          <Link to='/about' className="intro__link">Weiterlesen</Link>
        </div>
        <Img className="intro__image" image={indexPage.introImage.childImageSharp.gatsbyImageData} alt="Barbara Köller Portrait" />
        {/* <div className="intro__quote">
          <blockquote>
            <p>You don&apos;t have to be great to start, but you have to start to be great.</p>
          </blockquote>
        </div> */}
      </div>
    </Container>
    <Container id="gallery">
      <h2 className="container__headline">Gallerie</h2>
      {['Acryl', 'Öl', 'Aquarell', 'Pastell'].map((category) => (
        <React.Fragment key={category}>
          <h3 className="gallery__type">{category}</h3>
          <div className="projects">
            {projects.filter(({ node }) => node.frontmatter.type === category).map(({ node }) => {
              return (
                <Link to={node.fields.slug} key={`${category}-${node.id}`} className="project">
                  <Img
                    className="project__image"
                    image={node.frontmatter.coverImage.childImageSharp.gatsbyImageData}
                    alt={node.frontmatter.title}
                  />
                  <div className="project__info-container">
                    <div className="project__info">
                      <h2 className="project__headline">{node.frontmatter.title}</h2>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </React.Fragment>
      ))}
    </Container>
    <Container id="exhibitions">
      <h2 className="container__headline">Ausstellungen</h2>
      <div className="exhibitions">
        {(
          exhibitions.length === 1 ? <h2 className="no-exhibitions">Zurzeit sind keine Ausstellungen geplant.</h2>
            : exhibitions.map(({ node }) => {
              return (
                <div className="exhibition" key={node.id}>
                  <div className="exhibition__info">
                    <div className="exhibition__tag exhibition__date">{node.frontmatter.dateText}</div>
                    <div className="exhibition__tag exhibition__location">{node.frontmatter.location}</div>
                    <div className="exhibition__tag exhibition__price">{node.frontmatter.price}</div>
                  </div>
                  <div className="exhibition__content">
                    <h3 className="exhibition__headline">{node.frontmatter.title}</h3>
                    <p className="exhibition__desc">{node.frontmatter.description}</p>
                  </div>
                  <div className="exhibition__checkout">
                    <div className="exhibition__btn" onClick={() => shareEvent('https://bk-kunst.de', node.frontmatter.title, `Kunstausstellung von Bärbel Köller | ${node.frontmatter.dateText} | ${node.frontmatter.location}`)}>Teilen</div>
                    {/* <div className="exhibition__btn">Zum Kalender hinzufügen</div> */}
                  </div>
                </div>
              )
            }))}
      </div>
    </Container>
    <Container id="contact" styleModifier={['dark-theme']}>
      <h2 className="container__headline container__headline--light">Kontakt</h2>
      <div className="contact" dangerouslySetInnerHTML={{ __html: indexPage.contact }}>
        {/* <p className="contact__desc p p--light">Hallo! Für allgemeine Anfragen schick eine Email an <a href="mailto:bk-art@web.de">bk-art@web.de</a>. Wenn du Interesse an einem Kauf der Bilder hast, schicke eine <a href={`mailto:bk-art@web.de?subject=Kaufanfrage - ${new Date().toISOString()}`}>Kaufanfrage</a>.</p> */}
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
            type
            coverImage {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED, width: 800)
              }
            }
          }
        }
      }
    }
    exhibitions: allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/(\/content\/exhibitions)/.*\\.md$/"}}
      sort: { fields: [frontmatter___title], order: DESC }
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
    indexPage: allMarkdownRemark(      
      filter: {fileAbsolutePath: {regex: "/(\/content\/pages\/index)/.*\\.md$/"}}
    ) {
      edges {
        node {
          frontmatter {
            intro
            introImage {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED, width: 1920)
              }
            }
            contact
            coverImage {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED, width: 1920)
              }
            }
          }
        }
      }
    }
  }
`

IndexPage.propTypes = {
  data: PropTypes.object
}

export default IndexPage
