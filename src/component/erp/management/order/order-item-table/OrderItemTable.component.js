import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Container } from "./OrderItemTable.styled";
import SelectorButtonFieldView from "./SelectorButtonField.view";
import TableFieldView from "./TableField.view";
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'query-string';
import CommonModalComponent from "../../../../module/modal/CommonModalComponent";
import FixOrderItemModalComponent from "../fix-order-item-modal/FixOrderItemModal.component";

const OrderItemTableComponent = (props) => {
    const tableScrollRef = useRef();

    const [viewSize, dispatchViewSize] = useReducer(viewSizeReducer, initialViewSize);
    const [fixTargetItem, dispatchFixTargetItem] = useReducer(fixTargetItemReducer, initialFixTargetItem);

    const [fixItemModalOpen, setFixItemModalOpen] = useState(false);

    useEffect(() => {
        if (!props.orderItemList || props.orderItemList?.length <= 0) {
            return;
        }

        if (tableScrollRef && tableScrollRef.current) {
            tableScrollRef.current.scrollTop = 0;
        }

        dispatchViewSize({
            type: 'SET_DATA',
            payload: 50
        })
    }, [props.orderItemList]);

    const isCheckedAll = useCallback(() => {
        if (!props.orderItemList || props.orderItemList?.length <= 0) {
            return false;
        }

        return props.orderItemList.length === props.checkedOrderItemList.length;
    }, [props.checkedOrderItemList, props.orderItemList])

    const isCheckedOne = useCallback((id) => {
        return props.checkedOrderItemList.some(r => r.id === id);
    }, [props.checkedOrderItemList])


    const onActionCheckOrderItem = (e, orderItem) => {
        e.stopPropagation();
        props._onAction_checkOrderItem(e, orderItem);
    }

    const onActionCheckOrderItemAll = () => {
        props._onAction_checkOrderItemAll();
    }

    const onActionReleaseOrderItemAll = () => {
        props._onAction_releaseOrderItemAll();
    }

    const onActionfetchMoreOrderItems = async () => {
        let newSize = viewSize + 20;
        dispatchViewSize({
            type: 'SET_DATA',
            payload: newSize
        })
    }

    const onActionOpenFixItemModal = (e, orderItem) => {
        e.stopPropagation();
        dispatchFixTargetItem({
            type: 'SET_DATA',
            payload: orderItem
        })
        setFixItemModalOpen(true);
    }

    const onActionCloseFixItemModal = () => {
        dispatchFixTargetItem({
            type: 'CLEAR'
        })
        setFixItemModalOpen(false);
    }

    const onChangeFixTargetItem = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        dispatchFixTargetItem({
            type: 'CHANGE_DATA',
            payload: {
                name: name,
                value: value
            }
        })
    }

    const onActionConfirmUpdateFixOrderItem = (e) => {
        e.preventDefault();
        if (!fixTargetItem.uniqueCode) {
            alert('[????????? ????????????] ??? ?????? ?????? ??? ?????????.');
            return;
        }

        if (!fixTargetItem.prodName) {
            alert('[?????????] ??? ?????? ?????? ??? ?????????.');
            return;
        }

        if (!fixTargetItem.optionName) {
            alert('[????????????] ??? ?????? ?????? ??? ?????????.');
            return;
        }

        if (!fixTargetItem.unit) {
            alert('[??????] ??? ?????? ?????? ??? ?????????.');
            return;
        }

        if (!fixTargetItem.receiver) {
            alert('[????????????] ??? ?????? ?????? ??? ?????????.');
            return;
        }

        if (!fixTargetItem.receiverContact1) {
            alert('[????????????1] ??? ?????? ?????? ??? ?????????.');
            return;
        }

        if (!fixTargetItem.destination) {
            alert('[??????] ??? ?????? ?????? ??? ?????????.');
            return;
        }
        props._onSubmit_updateErpOrderItemOne(fixTargetItem);
        onActionCloseFixItemModal();
    }


    return (
        <>
            <Container>
                {(props.viewHeader && props.orderItemList) &&
                    <>
                        <SelectorButtonFieldView
                            onActionCheckOrderItemAll={onActionCheckOrderItemAll}
                            onActionReleaseOrderItemAll={onActionReleaseOrderItemAll}
                        ></SelectorButtonFieldView>
                        <TableFieldView
                            tableScrollRef={tableScrollRef}

                            viewHeader={props.viewHeader}
                            orderItemList={props.orderItemList}
                            viewSize={viewSize}
                            isCheckedOne={isCheckedOne}
                            isCheckedAll={isCheckedAll}

                            onActionCheckOrderItem={onActionCheckOrderItem}
                            onActionCheckOrderItemAll={onActionCheckOrderItemAll}
                            onActionfetchMoreOrderItems={onActionfetchMoreOrderItems}
                            onActionOpenFixItemModal={onActionOpenFixItemModal}
                        ></TableFieldView>
                    </>
                }
                {!props.viewHeader &&
                    <div style={{ textAlign: 'center', padding: '100px 0', fontWeight: '600' }}>??? ????????? ?????? ????????? ?????????.</div>
                }
            </Container>
            {(fixItemModalOpen && fixTargetItem) &&
                <CommonModalComponent
                    open={fixItemModalOpen}
                    fullWidth={true}
                    maxWidth={'sm'}

                    onClose={onActionCloseFixItemModal}
                >
                    <FixOrderItemModalComponent
                        fixTargetItem={fixTargetItem}

                        onChangeFixTargetItem={onChangeFixTargetItem}
                        onActionCloseFixItemModal={onActionCloseFixItemModal}
                        onActionConfirmUpdateFixOrderItem={onActionConfirmUpdateFixOrderItem}
                    ></FixOrderItemModalComponent>
                </CommonModalComponent>
            }
        </>
    );
}

export default OrderItemTableComponent;

const initialViewSize = 50;
const initialFixTargetItem = null;

const viewSizeReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return action.payload;
        default: return 50;
    }
}

const fixTargetItemReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return action.payload;
        case 'CHANGE_DATA':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case 'CLEAR':
            return initialFixTargetItem;
        default: return initialFixTargetItem;
    }
}