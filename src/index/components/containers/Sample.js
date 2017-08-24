import Sample from '../ui/Sample'
import {elem} from '../../actions/actions'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        param1:state.test
    }
}

const mapDispatchToProps = dispatch => {
    return {
        OnSampleClick(date) {
            dispatch(
              elem(date)
          )   
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sample)

