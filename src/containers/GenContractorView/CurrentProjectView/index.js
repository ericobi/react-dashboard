import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
// mui icons
import DeleteIcon from '@material-ui/icons/Delete';

// 3rd party and custom components
import removeMd from 'remove-markdown';
import CustomTableCell from '../../../components/shared/CustomTableCell';
import CustomSnackbar from '../../../components/shared/CustomSnackbar';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';

import { getProjectsByGenId } from '../../../actions/gen-actions';
import { deleteProject, setCurrentProject } from '../../../actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 128px)",
		margin: theme.spacing(1),
		overflow: "auto",
		position: "relative"
	},
	tableWrap: {
		overflow: "auto",
		maxHeight: "calc(100vh - 184px)",
	},
	row: {
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.background.default,
		},
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	},
	desc: {
		color: "#444",
		marginTop: "0",
		"& > p": {
			margin: theme.spacing(0, 0)
		}
	},
	busy: {
		position: "absolute",
		left: "calc(50% - 20px)",
		top: "calc(50% - 20px)"
	}
});

class connectedCurProView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isBusy: false,
			showMessage: false,
			message: '',
			variant: 'success',
			showConfirm: false,
			proId: 0
		};
	}

	componentDidMount() {
		const { userProfile } = this.props;
		this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, 0, 0);
	}

	handleChangePage = async (event, page) => {
		const { userProfile } = this.props;
		this.setState({ currentPage: page, isBusy: true });
		try {
			await this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage);
		} catch (error) {
			console.log('CurrentProjectView.handleChangePage', error);
		}
		this.setState({ isBusy: false });
	};

	handleChangeRowsPerPage = async event => {
		const { projects, userProfile } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= projects.totalElements ? 0 : this.state.currentPage;

		this.setState({ rowsPerPage, currentPage });
		try {
			await this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, currentPage, rowsPerPage);
		} catch (error) {
			console.log('CurrentProjectView.handleChangeRowsPerPage', error);
		}
		this.setState({ isBusy: false });
	};

	handleDeleteProject = async (id) => {
		const { userProfile, projects } = this.props;
		let msg = 'delete project success';

		this.setState({ isBusy: true, showConfirm: false });
		try {
			await this.props.deleteProject(this.state.proId);
			const curPage = this.state.currentPage;
			if (this.state.rowsPerPage * (this.state.currentPage) >= projects.totalElements - 1) curPage--;
			await this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, curPage, this.state.rowsPerPage);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: msg,
				currentPage: curPage
			});
		} catch (error) {
			console.log(error);
			msg = 'delete project failed';
			this.setState({
				isBusy: false,
				showMessage: true,
				message: msg
			});
		}
	}

	handleSelectProject = (id) => {
		const { match } = this.props;
		this.props.setCurrentProject(id);
		this.props.history.push("/g_cont/project_detail/" + id);
	}

	render() {
		const { classes, projects } = this.props;

		if (projects === null) {
			return <CircularProgress className={classes.waitingSpin} />;
		}

		return (
			<Paper className={classes.root}>
				<div className={classes.tableWrap} >
					<Table className={classes.table} size='small'>
						<TableHead>
							<TableRow>
								<CustomTableCell> Project Title </CustomTableCell>
								<CustomTableCell align="center">Budget</CustomTableCell>
								<CustomTableCell align="center">Discription</CustomTableCell>
								<CustomTableCell align="center">Action</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								projects.content.map(
									row => (
										<TableRow className={classes.row} key={row.id} hover>
											<CustomTableCell component="th" scope="row"
												onClick={() => this.handleSelectProject(row.id)}>
												<Typography className='nowrap'>{row.title}</Typography>
											</CustomTableCell>
											<CustomTableCell align="center"
												onClick={() => this.handleSelectProject(row.id)}>{row.budget}</CustomTableCell>
											<CustomTableCell align="center"
												onClick={() => this.handleSelectProject(row.id)}>
												<Typography className='nowrap'>{removeMd(row.description)}</Typography>
											</CustomTableCell>
											<CustomTableCell align="center">
												<IconButton aria-label="Delete" color="primary"
													onClick={() => this.setState({ showConfirm: true, proId: row.id })}>
													<DeleteIcon />
												</IconButton>
											</CustomTableCell>
										</TableRow>
									)
								)
							}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					style={{ overflow: "auto" }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={projects.totalElements}
					rowsPerPage={this.state.rowsPerPage}
					page={this.state.currentPage}
					backIconButtonProps={{ 'aria-label': 'Previous Page' }}
					nextIconButtonProps={{ 'aria-label': 'Next Page' }}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
				<CustomSnackbar
					open={this.state.showMessage}
					variant={this.state.variant}
					message={this.state.message}
					handleClose={() => this.setState({ showMessage: false })}
				/>
				<ConfirmDialog
					open={this.state.showConfirm}
					onYes={this.handleDeleteProject}
					onCancel={() => this.setState({ showConfirm: false })}
					message='Do you want to delete this project?'
				/>
				{this.state.isBusy && <CircularProgress className='busy' />}
			</Paper >
		);
	}
}


const mapDispatchToProps = dispatch => {
	return {
		getProjectsByGenId: (id, page, rowSize) => dispatch(getProjectsByGenId(id, page, rowSize)),
		deleteProject: (id, cb) => dispatch(deleteProject(id, cb)),
		setCurrentProject: (id) => dispatch(setCurrentProject(id)),
	};
};

const mapStateToProps = state => {
	return {
		projects: state.gen_data.projects,
		userProfile: state.global_data.userProfile
	};
};

connectedCurProView.propTypes = {
	classes: PropTypes.object.isRequired,
	projects: PropTypes.object,
	userProfile: PropTypes.object
};

const CurrentProjectView = connect(mapStateToProps, mapDispatchToProps)(connectedCurProView);
export default withRouter(withStyles(styles)(CurrentProjectView));