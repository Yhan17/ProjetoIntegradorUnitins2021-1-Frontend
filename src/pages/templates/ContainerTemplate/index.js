import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import React from 'react'
import logo from '~/assets/logo.svg'

import { Container, Header, Content, Footer, ContainerLimiter, HeaderMenu } from '../styles'
import { Button, ListBox, OverlayPanel, TabMenu } from '~/primereact'
import Loading from '~/pages/templates/components/Loading'
import { menuItems } from '../menuItems'

function ContainerTemplate({
	children,
	contentClassName = '',
	contentStyle = {},
	contentContainerClassName ='',
	contentContainerStyle = {},
	loading
}) {
	const op = React.useRef(null)
	const history = useHistory()

	const handleTabChange = e => {
		history.push(e.value.destination)
	}

	return (
		<Container>
			{loading && <Loading/>}
			<Header>
				<ContainerLimiter className='p-d-flex p-mx-auto p-jc-between p-ai-center'>
					<img draggable={false} src={logo} alt='Logo do sistema SIMOV' height='50'/>
					<HeaderMenu>
						<TabMenu className='desktop' model={menuItems} activeIndex={-1} onTabChange={handleTabChange}/>
						<Button className='mobile' type="button" icon='fas fa-bars' onClick={e => op.current.toggle(e)} />

						<OverlayPanel ref={op} className='mobile'>
							<ListBox options={menuItems} onChange={handleTabChange} />
						</OverlayPanel>
					</HeaderMenu>
				</ContainerLimiter>
			</Header>
			<Content className={contentClassName} style={contentStyle}>
				<ContainerLimiter className={`container p-mb-5 ${contentContainerClassName}`} style={contentContainerStyle}>
					{children}
				</ContainerLimiter>
			</Content>
			<Footer>
				<ContainerLimiter className='p-mx-auto'>
					SIMOV Coapa - Sistemas de Gerenciamento de Visitas Coapa 2021
				</ContainerLimiter>
			</Footer>
		</Container>
	)
}

ContainerTemplate.propTypes = {
	children: PropTypes.any,
	contentClassName: PropTypes.string,
	contentContainerClassName: PropTypes.string,
	contentStyle: PropTypes.any,
	contentContainerStyle: PropTypes.any,
	loading: PropTypes.bool
}

export default ContainerTemplate