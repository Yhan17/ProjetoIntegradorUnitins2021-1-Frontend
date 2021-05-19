import React from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import { InputContainer } from '~/common/components'
import { InputWrapper } from '~/common/styles'
import { Dialog, InputNumber, InputText } from '~/primereact'
import { getInvalidClass } from '~/utils'

function Modal({ editable = true, formData, headerName, buttons, visible, control, errors, onSubmit, hideModal }) {
	return (
		<Dialog
			draggable={false}
			header={<h1>{headerName}</h1>} 
			className='p-fluid' 
			visible={visible} 
			onHide={hideModal} 
			breakpoints={{'960px': '75vw', '640px': '100vw'}} 
			style={{width: '50vw'}}>
			<form onSubmit={onSubmit}>
				<InputWrapper columns={2} gap='10px'>
					<Controller
						name='nome'
						defaultValue={formData?formData.nome:''}
						control={control}
						rules={{required: 'É necessário dar um nome a propriedade'}}
						render={({ name, value, onChange }) => (
							<InputContainer name={name} error={errors[name]} label='Nome'>
								<InputText
									name={name}
									value={value}
									disabled={!editable}
									className={getInvalidClass(errors[name])}
									onChange={evt => onChange(evt.target.value)}
								/>
							</InputContainer>
						)}
					/>
					<Controller
						name='area'
						defaultValue={formData?formData.area:null}
						control={control}
						rules={{required: 'É necessário informar a area da propriedade'}}
						render={({ name, value, onChange }) => (
							<InputContainer name={name} error={errors[name]} label='Tamanho'>
								<InputNumber
									name={name}
									showButtons
									value={value}
									suffix=' hectares'
									disabled={!editable}
									buttonLayout="horizontal"
									incrementButtonIcon="pi pi-plus"
									decrementButtonIcon="pi pi-minus"
									onChange={evt => onChange(evt.value)}
									className={getInvalidClass(errors[name])}
								/>
							</InputContainer>
						)}
					/>
				</InputWrapper>
				<Controller
					name='localidade'
					defaultValue={formData?formData.localidade:''}
					control={control}
					rules={{required: 'É preciso informar o local da Propriedade'}}
					render={({ name, value, onChange }) => (
						<InputContainer name={name} error={errors[name]} label='Localidade'>
							<InputText
								name={name}
								value={value}
								disabled={!editable}
								className={getInvalidClass(errors[name])}
								onChange={evt => onChange(evt.target.value)}
							/>
						</InputContainer>
					)}
				/>
				<InputWrapper columns={2} gap='10px'>
					<Controller
						name='registro'
						defaultValue={formData?formData.registro:''}
						control={control}
						rules={{required: 'O id da propriedade é necessário'}}
						render={({ name, value, onChange }) => (
							<InputContainer name={name} error={errors[name]} label='# da Matrícula'>
								<InputText
									name={name}
									value={value}
									disabled={!editable}
									className={getInvalidClass(errors[name])}
									onChange={evt => onChange(evt.target.value)}
								/>
							</InputContainer>
						)}
					/>
					<Controller
						name='tecnico'
						defaultValue={formData?formData.tecnico:''}
						control={control}
						rules={{required: 'É necessário selecionar o tecnico'}}
						render={({ name, value, onChange }) => (
							<InputContainer name={name} error={errors[name]} label='Técnico Responsável'>
								<InputText
									name={name}
									value={value}
									disabled={!editable}
									className={getInvalidClass(errors[name])}
									onChange={evt => onChange(evt.target.value)}
								/>
							</InputContainer>
						)}
					/>
				</InputWrapper>
				{buttons}
			</form>
		</Dialog>
		
	)
}

Modal.propTypes = {
	headerName: PropTypes.string,
	hideModal: PropTypes.func,
	onSubmit: PropTypes.func,
	visible: PropTypes.bool,
	editable: PropTypes.bool,
	buttons: PropTypes.element,
	control: PropTypes.any,
	errors: PropTypes.any,
	formData: PropTypes.shape({
		nome: PropTypes.string,
		area: PropTypes.number,
		localidade: PropTypes.string,
		registro: PropTypes.string,
		tecnico: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		])
	})
}

export default Modal