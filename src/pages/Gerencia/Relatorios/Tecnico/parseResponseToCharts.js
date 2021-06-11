import { formatDate, getRandomColor } from '~/utils'
import Visita from '../model/Visita'

/** @typedef  @param {{visitas: {diaVisita: string,motivos: string, propriedade: string,status: string, cooperado: string}[],tecnico: {associado_em: string, nome: string, sobrenome: string, email: string, phone: string},periodo: {inicio: string, fim: string},}} apiResponse @param {string} viewType */
function parseResponseToCharts(apiResponse, viewType) {
	/** @param {Visita[]} parsedVisitas @param {string[]} motivos @param {Color[]} colors */
	function getLineChartData(parsedVisitas, motivos, colors) {
		const labels = [...new Set(parsedVisitas.map(v => formatDate(v.diaVisita, viewType)))]
		const datasets = []

		console.log(labels, datasets)
		for (const [i,m] of Object.entries(motivos)) {
			/** @type {{[x:string]: number}} */
			const objectLabels = labels.reduce((acc, l) => ({...acc,[l]: 0}), {})
			
			const visitsOfP = parsedVisitas.filter(v => v.motivos.includes(m))

			visitsOfP.forEach(v => ++objectLabels[formatDate(v.diaVisita, viewType)])

			const dataOfP = {
				label: m,
				fill: false,
				borderColor: colors[+i].getHex(),
				data: Object.values(objectLabels)
			}

			datasets.push(dataOfP)
		}
	
		return {
			labels,
			datasets
		}
	}
	
	/** @param {Visita[]} parsedVisitas @param {string[]} motivos @param {Color[]} colors */
	function getPizzaChartData(parsedVisitas, motivos, colors) {

		/** @type {{[x:string]: number}} */
		const objectLabels = motivos.reduce((acc, l) => ({...acc,[l]: 0}), {})
		const labels = motivos

		parsedVisitas.forEach(v => v.motivos.map(m => ++objectLabels[m]))
		
		return {
			labels,
			datasets: [
				{
					data: Object.values(objectLabels),
					backgroundColor: colors.map(c => c.getHex()),
					hoverBackgroundColor: colors.map(c => c.getHigherBrightness(0.18).getHex())
				}
			]
		}
	}

	/** @param {Visita[]} parsedVisitas @param {string[]} propriedades */
	function getTecnicoTableData(parsedVisitas, propriedades) {
		/** @type {{[x:string]: { propriedade: string, tecnico: string, completed: number, canceled: number, total: number }}} */
		const propriedadesData = propriedades.reduce((acc, propriedade) => ({...acc,[propriedade]: {
			propriedade,
			cooperado: '',
			opened: 0,
			completed: 0,
			canceled: 0,
			total: 0
		}}), {})

		for (const visita of parsedVisitas) {
			const { cooperado, propriedade, status } = visita

			const data = propriedadesData[propriedade]

			if (status === 'aberto') data.opened++
			if (status === 'cancelado') data.canceled++
			if (status === 'concluido') data.completed++

			data.total++
			data.cooperado = cooperado
		}

		return Object.values(propriedadesData)
	}

	/** @param {Visita[]} parsedVisitas @param {string[]} motivos */
	function getMotivoTableData(parsedVisitas, motivos) {
		const motivosData = motivos.reduce((acc, m) => ({...acc, [m]: {
			motivo: m,
			opened: 0,
			completed: 0,
			canceled: 0,
			total: 0,
		}}), {})


		for (const visita of parsedVisitas) {
			const { motivos, status } = visita

			for (const motivo of motivos) {
				const data = motivosData[motivo]

				if (status === 'aberto') data.opened++
				if (status === 'cancelado') data.canceled++
				if (status === 'concluido') data.completed++

				data.total++
			}
		}

		return Object.values(motivosData)
	}

	const { visitas } = apiResponse
	
	const parsedVisitas = visitas.map(v => Visita.parseFromApi(v))

	const propriedades = [...new Set(parsedVisitas.map(v => v.propriedade))]
	const motivos = [...new Set(parsedVisitas.map(v => v.motivos).flat(Infinity))]
	const colors = motivos.map(() => getRandomColor())
	
	const lineChartData = getLineChartData(parsedVisitas, motivos, colors)
	const pizzaChartData = getPizzaChartData(parsedVisitas, motivos, colors)
	const tecnicoTableData = getTecnicoTableData(parsedVisitas, propriedades)
	const motivoTableData = getMotivoTableData(parsedVisitas, motivos)

	console.log('pizzaChartData',pizzaChartData)
	return {
		lineChartData,
		pizzaChartData,
		tecnicoTableData,
		motivoTableData
	}
}

export default parseResponseToCharts