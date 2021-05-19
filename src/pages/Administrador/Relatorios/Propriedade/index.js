import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { InputContainer } from '~/common/components'
import { InputWrapper } from '~/common/styles'
import { Button, Calendar, Dropdown} from '~/primereact'
import { ManagementTemplate } from '~/template'
import { getInvalidClass } from '~/utils'

function RelatorioPropriedade() {
	const { control, errors, handleSubmit, reset } = useForm()

	const [startDate, setStartDate] = React.useState(null)
	const [endDate, setEndDate] = React.useState(null)

  const [groupOptions] = React.useState([
		{label: 'Recanto', value: 1},
		{label: 'Cargueiros', value: 2},
		{label: 'Brejão', value: 3},
		{label: 'Veredas', value: 4},
		{label: 'Itabirinhas', value: 5}
	])
  const enviar = form => {
    console.log(form) // eslint-disable-line

		reset()
  }

	/** @param {'start' | 'end'} key */
	const handleDateChange = (key, valueSetter) => {
		const handler = {
			start: setStartDate,
			end: setEndDate
		}[key]
		
		return evt => {
			handler(evt.value)
			valueSetter(evt.value)
		}
	}

  return (
  <ManagementTemplate title='Relatório de Propriedade'>
		<form onSubmit={handleSubmit(enviar)}>
			<InputWrapper columns={2} gap='10px'>
				<Controller
					name='start'
					control={control}
					defaultValue={null}
					rules={{required: 'Você precisa informar o inicio do relatório.'}}
					render={({ name, value, onChange }) => (
						<InputContainer name={name} label='Inicio' error={errors[name]}>
							<Calendar
								showIcon
								name={name}
								value={value}
								mask='99/99/9999'
								maxDate={endDate}
								className={getInvalidClass(errors[name])}
								onChange={handleDateChange(name, onChange)}/>
						</InputContainer>
					)}/>
					<Controller
						name='end'
						control={control}
						defaultValue={null}
						rules={{required: 'Você precisa informar o final do relatório.'}}
						render={({ name, value, onChange }) => (
							<InputContainer name={name} label='Fim' error={errors[name]}>
								<Calendar
									showIcon
									name={name}
									value={value}
									mask='99/99/9999'
									minDate={startDate}
									className={getInvalidClass(errors[name])}
									onChange={handleDateChange(name, onChange)}/>
							</InputContainer>
						)}/>
			</InputWrapper>
			<Controller
				name='cooperado'
				control={control}
				defaultValue={null}
				rules={{required: 'Você precisa selecionar um cooperado.'}}
				render={({ name, value, onChange }) => (
					<InputContainer name={name} label='Cooperado' error={errors[name]}>
						<Dropdown
							showIcon
							name={name}
							value={value}
							options={groupOptions}
							className={getInvalidClass(errors[name])}
							onChange={evt => onChange(evt.value)}/>
					</InputContainer>
				)}/>
				<Controller
					name='propriedade'
					control={control}
					defaultValue={null}
					rules={{required: 'Você precisa selecionar a propriedade.'}}
					render={({ name, value, onChange }) => (
						<InputContainer name={name} label='Cooperado' error={errors[name]}>
							<Dropdown
								showIcon
								name={name}
								value={value}
								options={groupOptions}
								className={getInvalidClass(errors[name])}
								onChange={evt => onChange(evt.value)}/>
						</InputContainer>
					)}/>
			<Button type='submit' label='Gerar Relatório'/>
		</form>
		
	</ManagementTemplate>
  )}

export default RelatorioPropriedade