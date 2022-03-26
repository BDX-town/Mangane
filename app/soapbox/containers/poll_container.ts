import { connect } from 'react-redux';

import Poll from 'soapbox/components/poll';

import type { RootState } from 'soapbox/store';

interface IPollContainer {
  pollId: string,
}

const mapStateToProps = (state: RootState, { pollId }: IPollContainer) => ({
  poll: state.polls.get(pollId),
  me: state.me,
});


export default connect(mapStateToProps)(Poll);
