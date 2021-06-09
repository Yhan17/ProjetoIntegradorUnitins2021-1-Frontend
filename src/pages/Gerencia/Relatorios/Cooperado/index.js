import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useHistory } from 'react-router'

import { getApiResponseErrors, getInvalidClass } from '~/utils'
import { Button, Calendar, Dropdown, Toast} from '~/primereact'
import parseResponseToCharts from './parseResponseToCharts'
import { ManagementTemplate } from '~/pages/templates'
import { InputContainer } from '~/common/components'
import { api, getToastInstance } from '~/services'
import * as validate from '~/config/validations'
import { InputWrapper } from '~/common/styles'
import { viewTypes } from '../viewTypes'

function RelatorioCooperado() {
	const { control, errors, handleSubmit, reset } = useForm()
	
  const [cooperados, setCooperados] = useState([])
	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)

	const [loading, setLoading] = useState(false)

	const toastRef = useRef(null)
	const toast = getToastInstance(toastRef)

	const history = useHistory()

	useEffect(() => {
		loadCooperados()
	}, [])

	async function loadCooperados() {
		try {
			setLoading(true)
			const { data } = await api.get('/cooperado/index')

			setCooperados(data)
		} catch ({ response }) {
			toast.showErrors(getApiResponseErrors(response))
		} finally {
			setLoading(false)
		}
	}

  async function gerarRelatorio(form) {
    const { view, ...params } = form
		const dataJSON = JSON.stringify(form)

		try {
			setLoading(true)
			
			const { data } = await api.get('/relatorio/cooperado', { params })

			const chartData = parseResponseToCharts(data, view)

			history.push(`/cooperados/relatorio/${btoa(dataJSON)}`, chartData)
		} catch ({ response }) {
			
		} finally {
			setLoading(false)
		}
		return 
		reset()
		history.push()
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
  <ManagementTemplate title='Relatório de Cooperado' loading={loading}>
		<Toast ref={toastRef}/>
		<form onSubmit={handleSubmit(gerarRelatorio)}>
			<InputWrapper columns={2} gap='10px'>
				<Controller
					name='start'
					control={control}
					defaultValue={null}
					rules={validate.startRelatorio}
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
					rules={validate.endRelatorio}
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
				rules={validate.selectCooperado}
				render={({ name, value, onChange }) => (
				<InputContainer name={name} label='Cooperado' error={errors[name]}>
					<Dropdown
						showIcon
						name={name}
						value={value}
						optionValue='id'
						options={cooperados}
						optionLabel='nome_cooperado'
						className={getInvalidClass(errors[name])}
						onChange={evt => onChange(evt.value)}/>
				</InputContainer>
			)}/>
			<Controller
				name='view'
				control={control}
				defaultValue={null}
				rules={validate.dropdownGeneric}
				render={({ name, value, onChange }) => (
				<InputContainer name={name} label='Visualização' error={errors[name]}>
					<Dropdown
						showIcon
						name={name}
						value={value}
						options={viewTypes}
						className={getInvalidClass(errors[name])}
						onChange={evt => onChange(evt.value)}/>
				</InputContainer>
			)}/>
			<Button type='submit' label='Gerar Relatório'/>
		</form>
	</ManagementTemplate>
  )}

export default RelatorioCooperado