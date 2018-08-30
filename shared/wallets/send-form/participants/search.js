// @flow
import * as React from 'react'
import * as Styles from '../../../styles'
import ResultsList from '../../../search/results-list/container'
import UserInput from '../../../search/user-input/container'
import {Box2} from '../../../common-adapters'
import {ParticipantsRow} from '../../common'

export type SearchProps = {|
  onClickResult: (username: string) => void,
  onClose: () => void,
  onShowTracker: (username: string) => void,
|}

type SearchState = {|
  displayResultsList: boolean,
|}

const searchKey = 'walletSearch'
const placeholder = 'Search Keybase'

// TODO: Once UserInput is cleaned up, we may be able to stretch it
// properly horizontally without wrapping a vertical Box2 around it.
class Search extends React.Component<SearchProps, SearchState> {
  state = {
    displayResultsList: false,
  }

  onChangeSearchText = (text: string) => {
    this.setState({displayResultsList: !!text})
  }

  closeResultsList = () => this.setState({displayResultsList: false})

  render() {
    return (
      <React.Fragment>
        <ParticipantsRow heading="To" style={styles.row} headingStyle={styles.rowHeading}>
          <Box2 direction="vertical" fullWidth={true}>
            <UserInput
              searchKey={searchKey}
              autoFocus={true}
              onChangeSearchText={this.onChangeSearchText}
              placeholder={placeholder}
              onExitSearch={this.closeResultsList}
              disableListBuilding={true}
              showServiceFilter={false}
              style={styles.input}
            />
          </Box2>
        </ParticipantsRow>
        {this.state.displayResultsList && (
          <ResultsList
            searchKey={searchKey}
            onClick={this.props.onClickResult}
            onShowTracker={this.props.onShowTracker}
            disableListBuilding={true}
            style={styles.list}
          />
        )}
      </React.Fragment>
    )
  }
}

const styles = Styles.styleSheetCreate({
  row: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  rowHeading: {
    marginRight: 0, // Removing the right margin on the heading is to offset some left margin in UserInput
  },
  input: {
    borderWidth: 0,
    paddingLeft: 0,
  },
  list: Styles.platformStyles({
    isElectron: {
      position: 'absolute',
      top: 93, // This is the exact height of the header + the input + the divider
      zIndex: 4,
      backgroundColor: Styles.globalColors.white,
      height: 432, // 525 (height of popup) - 93
      width: '100%',
      overflowY: 'scroll',
    },
  }),
})

export default Search
