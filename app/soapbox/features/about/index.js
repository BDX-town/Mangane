import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { fetchAboutPage } from 'soapbox/actions/about';

class AboutPage extends ImmutablePureComponent {

  state = {
    pageHtml: '',
  }

  loadPageHtml = () => {
    const { dispatch, match } = this.props;
    const { slug } = match.params;
    dispatch(fetchAboutPage(slug)).then(response => {
      this.setState({ pageHtml: response.data });
    }).catch(error => {
      // TODO: Better error handling. 404 page?
      this.setState({ pageHtml: '<h1>Page not found</h1>' });
    });
  }

  componentWillMount() {
    this.loadPageHtml();
  }

  componentDidUpdate(prevProps, prevState) {
    const { slug } = this.props.match.params;
    const { slug: prevSlug } = prevProps.match.params;
    if (slug !== prevSlug) this.loadPageHtml();
  }

  render() {
    return (
      <div className='content'>
        <div className='box-widget'>
          <div
            className='rich-formatting'
            dangerouslySetInnerHTML={{ __html: this.state.pageHtml }}
          />
        </div>
      </div>
    );
  }

}

export default connect()(AboutPage);
