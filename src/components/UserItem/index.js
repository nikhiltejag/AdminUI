import { Component } from 'react'

import {AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai'
import {VscCheckAll} from 'react-icons/vsc'

import './index.css'

class UserItem extends Component{
    state = {
        isEditorOn: false,
        name: '', email: '', role: '', id: '',
    }

    componentDidMount(){
        const {details} = this.props
        const {name, email, role, id} = details

        this.setState({name, email, role, id})
    }

    onClickEdit = () => {
        this.setState({isEditorOn: true})
    }

    onClickDelete = () => {
        const {id} = this.state
        const {onDeleteUser} = this.props

        onDeleteUser(id)
    }

    onClickSave = () => {
        const {onSaveChanges} = this.props

        const {name, email, role, id} = this.state

        this.setState({isEditorOn: false}, onSaveChanges({name, id, role, email}))
    }

    onChangeName = event => {
        this.setState({name: event.target.value})
    }

    onChangeEmail = event => {
        this.setState({email: event.target.value})
    }

    onChangeRole = event => {
        this.setState({role: event.target.value})
    }

    renderActions = () => {
        const {isEditorOn} = this.state

        const editorOfActions = (
            <div className='actions-container'>
                <button type='button' className='actions-button' onClick={this.onClickEdit}>
                    <AiOutlineEdit className='action edit-icon' />
                </button>
                <button type='button' className='actions-button' onClick={this.onClickDelete}>
                    <AiOutlineDelete className='action delete-icon'/>
                </button>
                </div>
        )

        const editorOnActions = (
            <div className='actions-container'>
                <button type='button' className='actions-button' onClick={this.onClickSave}>
                    <VscCheckAll className='save-icon' />
                </button>
            </div>
        )

        return isEditorOn ? editorOnActions : editorOfActions
    }

    renderDetails = () => {
        const {isEditorOn, name, email, role} = this.state

        if (isEditorOn){
            return (
                <>
                    <input type='text' className='details-field details-input' value={name} onChange={this.onChangeName} />
                    <input type='text' className='details-field details-input' value={email} onChange={this.onChangeEmail} />
                    <input type='text' className='details-field details-input' value={role} onChange={this.onChangeRole} />
                </>
            )}
        return (
            <>
                <p className='details-field'>{name}</p>
                <p className='details-field'>{email}</p>
                <p className='details-field'>{role}</p>
            </>
        )
        }

        onClickCheckbox = event => {
            const {onSelectUser} = this.props
            const {id} = this.state
            // console.log(event.target.checked)
            onSelectUser(id, event.target.checked)          
        }

    render(){
        const {isSelected} = this.props

        const userItemCss = isSelected ? 'user-item selected-user': 'user-item'

        return (
            <li className={userItemCss}>
                <div className='checkbox-container'>
                    <input type='checkbox' className='select-box' onChange={this.onClickCheckbox} checked={isSelected}/>
                </div>
                <div className='details-field-container'>
                {this.renderDetails()}
                </div>
                {this.renderActions()}
            </li>
        )
    }
}

export default UserItem