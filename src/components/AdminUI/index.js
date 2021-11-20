import { Component } from 'react'
import Loader from 'react-loader-spinner'

import UserItem from '../UserItem'

import {AiOutlineDoubleLeft, AiOutlineLeft, AiOutlineDoubleRight, AiOutlineRight} from 'react-icons/ai'

import {AiOutlineDisconnect} from 'react-icons/ai'

import './index.css'

const apiStatusConst = {
    initial: 'INITIAL',
    success: 'success',
    noData: 'NO_DATA',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

class AdminUI extends Component{
    state = {
        usersList: [],
        apiStatus: apiStatusConst.initial,
        currentPage: 1,
        searchInput: '', pagesCount: 1,
        selectedUserIds: [],
        selectAll: false,
    }

    componentDidMount(){
        this.getUsersList()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentPage !== prevState.currentPage) {
          this.setState({selectAll: false, selectedUserIds: []})
        }
      }

    getUsersList = async () => {
        this.setState({apiStatus: apiStatusConst.inProgress})

        const url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'

        try{
            const response = await fetch(url)
            const data = await response.json()
            this.setState({apiStatus: apiStatusConst.success, usersList: data})
            
            // else{
            //     console.log('failure')
            //     this.setState({apiStatus: apiStatusConst.failure})
            // }
        }catch(error){
            this.setState({apiStatus: apiStatusConst.failure})
        }
    }

    renderLoader = () => (
        <div className='loader-container'>
            <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
        </div>
        
    )

    renderFailureView = () =>  (
            <div className='failure-view-container'>
                <AiOutlineDisconnect />
                <p className='failure-text'>Something went wrong, Please check your connection or try again later !</p>
            </div>
        )


    getFilteredUsersList = () => {
        const {usersList, searchInput} = this.state

        const filteredList = usersList.filter(each => each.name.toLowerCase().includes(searchInput.toLowerCase()) || 
        each.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        each.role.toLowerCase().includes(searchInput.toLowerCase()) ) 
        return filteredList
    }

    onSaveChanges = details => {
        const {id, name, email, role} = details

        this.setState(prevState => prevState.usersList.map(each => {
            if (each.id === id){
                return {name, email, role, id}
            }
            return each
        }))
    }

    onClickSelectAll = (event, currentPageList) => {
        if (event.target.checked){
            this.setState({selectedUserIds: currentPageList.map(each => each.id), selectAll: true})
        }else{
            this.setState( {selectedUserIds: [], selectAll: false})
        }
        
    }

    renderColumnTitles = currentPageList => {
        const {selectAll} = this.state

        return (
            <li className='user-item'>
                <div className='checkbox-container'>
                    <input type='checkbox' className='select-box' checked={selectAll} onChange={(event) => this.onClickSelectAll(event, currentPageList)}/>
                </div>
                <div className='details-field-container'>
                <p className='details-field title'>Name</p>
                <p className='details-field title'>Email</p>
                <p className='details-field title'>Role</p>
                </div>
                <>
                <p className='title'>Actions</p>
                </>
            </li>
        )
    }

    onSelectUser = (id, checked) => {
        // console.log(isChecked)
        const {selectedUserIds} = this.state
        if (checked){
            this.setState({selectedUserIds: [...selectedUserIds, id]})
        }else{
            this.setState({selectedUserIds: selectedUserIds.filter(each => each !== id)})
        }
    }

    onDeleteUser = id => {
        this.setState(prevState => ({
            usersList: prevState.usersList.filter(each => each.id !== id)
        }))
    }

    deleteSelected = () => {
        const {selectedUserIds, usersList} = this.state
        // console.log(selectedUserIds)
        // console.log(usersList)

        const filteredList = usersList.filter(each => !selectedUserIds.includes(each.id))
        console.log(filteredList)

        this.setState({usersList: filteredList, selectedUserIds: []})
    }

    onClickFirstPage = () => {
        this.setState({currentPage: 1})
    }

    goToPrevPage = () => {
        const {currentPage} = this.state

        if (currentPage > 1){
            this.setState({currentPage: currentPage - 1})
        }
    }

    changePage = event => {
        this.setState({currentPage: parseInt(event.target.textContent)})
    }

    goToNextPage = () => {
        const {currentPage} = this.state
        console.log(currentPage)
        this.setState({currentPage: currentPage + 1})
    }

    renderUsersList = () => {
        const usersList = this.getFilteredUsersList()

        if (usersList.length === 0){
            this.setState({apiStatus: apiStatusConst.noData})
        }

        const usersCount = usersList.length
        const pagesCount = Math.ceil(usersCount/10)

        const pageNum = [...Array(pagesCount).keys()]

        const {currentPage} = this.state
        
        const startIndex = (currentPage-1)*10

        const currentPageList = usersList.slice(startIndex, startIndex + 10)

        const {selectedUserIds} = this.state

        return (
            <>
            <ul className='users-list-container'>
                {this.renderColumnTitles(currentPageList)}
                {currentPageList.map(each => <UserItem key={each.id} details={each} 
                onSaveChanges={this.onSaveChanges} onDeleteUser={this.onDeleteUser}
                onSelectUser={this.onSelectUser} isSelected={selectedUserIds.includes(each.id)} />)}
            </ul>
            <div className='delete-pagenation-container'>
                <button type='button' className='delete-selected-button' onClick={this.deleteSelected}>Delete Selected <span className='selected-count'> ({selectedUserIds.length}) </span> </button>
                <div className='pagenation-container'>
                    <button type='button' className={currentPage > 1 ? 'pagenation-button': 'pagenation-button current-page'} onClick={this.onClickFirstPage}>
                        <AiOutlineDoubleLeft/>
                    </button>
                    <button type='button' className={currentPage > 1 ? 'pagenation-button': 'pagenation-button current-page'} onClick={this.goToPrevPage}>
                        <AiOutlineLeft/>
                    </button>
                    {pageNum.map(each => <button key={each} type='button' className={currentPage === each+1 ? 'pagenation-button large-screen current-page': 'pagenation-button large-screen'} onClick={this.changePage} >{each+1}</button>)}
                    <button type='button' className={currentPage < pageNum.length ? 'pagenation-button': 'pagenation-button current-page'} onClick={currentPage < pageNum.length?this.goToNextPage: null }>
                        <AiOutlineRight/>
                    </button>
                    <button type='button' className={currentPage < pageNum.length ? 'pagenation-button': 'pagenation-button current-page'} onClick={()=> this.setState({currentPage: pageNum.length})}>
                        <AiOutlineDoubleRight/>
                    </button>
                </div>
                <div className='small-screen-buttons-container'>
                        {pageNum.map(each => <button key={each} type='button' className={currentPage === each+1 ? 'pagenation-button small-screen current-page': 'pagenation-button small-screen'} onClick={this.changePage} >{each+1}</button>)}
                </div>
            </div>
            </>
    )
    } 

    renderApp = () => {
        const {apiStatus} = this.state

        switch (apiStatus){
            case apiStatusConst.success:
                return this.renderUsersList()
            case apiStatusConst.noData:
                return <p className='no-data-description'>No Data Found</p>
            case apiStatusConst.inProgress:
                return this.renderLoader()
            case apiStatusConst.failure:
                return this.renderFailureView()
            default:
                return null
        }
    }

    onChangeSearchInput = event => {
        this.setState({searchInput: event.target.value, currentPage: 1, apiStatus: apiStatusConst.success})
    }

    render(){
        const {searchInput} = this.state

        return (
            <div className='app-container'>
                <div className='responsive-container'>
                    <input type='search' className='search-input' placeholder='Search by name, email or role'
                    value={searchInput} onChange={this.onChangeSearchInput} />
                    {this.renderApp()}
        </div>
    </div>
        )
    }
}

export default AdminUI