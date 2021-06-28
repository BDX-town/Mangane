import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { fetchAboutPage } from 'soapbox/actions/about';
import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { languages } from '../preferences';

const mapStateToProps = state => ({
  locale: getSettings(state).get('locale'),
  aboutPages: getSoapboxConfig(state).get('aboutPages'),
});

@connect(mapStateToProps)
@injectIntl
class AboutPage extends ImmutablePureComponent {

  state = {
    pageHtml: '',
    locale: this.props.locale,
  }

  loadPageHtml = () => {
    const { dispatch, match, aboutPages } = this.props;
    const { locale } = this.state;
    const { slug } = match.params;
    const page = aboutPages.get(slug || 'about');
    const fetchLocale = page && locale !== page.get('default') && page.get('locales').includes(locale);
    dispatch(fetchAboutPage(slug, fetchLocale && locale)).then(html => {
      this.setState({ pageHtml: html });
    }).catch(error => {
      // TODO: Better error handling. 404 page?
      this.setState({ pageHtml: '<h1>Page not found</h1>' });
    });
  }

  setLocale = (locale) => () => {
    this.setState({ locale });
  };

  componentDidMount() {
    this.loadPageHtml();
  }

  componentDidUpdate(prevProps, prevState) {
    const { locale, match, aboutPages } = this.props;
    const { locale: prevLocale, aboutPages: prevAboutPages } = prevProps;
    const { locale: stateLocale } = this.state;
    const { locale: prevStateLocale } = prevState;

    const { slug } = match.params;
    const { slug: prevSlug } = prevProps.match.params;

    if (locale !== prevLocale) this.setState({ locale });

    if (
      slug !== prevSlug ||
      stateLocale !== prevStateLocale ||
      (!prevAboutPages.get(slug || 'about') && aboutPages.get(slug || 'about'))
    )
      this.loadPageHtml();
  }

  render() {
    const { match, aboutPages } = this.props;
    const { slug } = match.params;

    const page = aboutPages.get(slug || 'about');
    const defaultLocale = page && page.get('default');
    const alsoAvailable = page && (
      <div className='rich-formatting also-available'>
        <FormattedMessage id='about.also_available' defaultMessage='Available in:' />
        {' '}
        <ul>
          <li>
            <a href='#' onClick={this.setLocale(defaultLocale)}>
              {languages[defaultLocale] || defaultLocale}
            </a>
          </li>
          {
            page.get('locales').map(locale => (
              <li key={locale}>
                <a href='#' onClick={this.setLocale(locale)}>
                  {languages[locale] || locale}
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    );

    return (
      <div className='content'>
        <div className='about-page'>
          <div
            className='rich-formatting'
            dangerouslySetInnerHTML={{ __html: this.state.pageHtml }}
          />
          {alsoAvailable}
        </div>
      </div>
    );
  }

}

export default AboutPage;
