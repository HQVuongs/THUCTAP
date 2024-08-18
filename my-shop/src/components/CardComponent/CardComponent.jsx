import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'

const CardComponent = (props) => {
    const {countInStock, description, image, name, price, rating, type, discount, selled} = props

  return (
    <WrapperCardStyle
        hoverable
        style={{ width: 200 }}
        styles={ {body:{ padding: '10px'}}}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReportText>
            <span style={{ marginRight: '4px'}}>
                <span>{rating}</span><StarFilled style={{ fontSize: '12px', color: 'rgb(255,215,0)' }} />
            </span>
            <WrapperStyleTextSell> | Đã bán {selled || 1000}</WrapperStyleTextSell>
        </WrapperReportText>
        <WrapperPriceText>
            <span style={{ marginRight: '8px'}}>{price}</span>
            <WrapperDiscountText>
                {discount || 5} %
            </WrapperDiscountText>
        </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent
