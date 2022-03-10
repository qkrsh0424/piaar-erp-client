import { useCallback, useReducer, useState } from 'react';
import { dateToYYYYMMDDhhmmss } from '../../../../utils/dateFormatUtils';
import Ripple from '../../../template/button/Ripple';
import ConfirmModalComponent from '../../../template/modal/ConfirmModalComponent';
import { ButtonBox, Container, OperatorWrapper, TableBox, TableWrapper } from './FirstMergedItemTable.styled';

const initialCheckedItemListState = [];
const checkedItemListStateReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return action.payload;
        case 'CLEAR':
            return [];
        default: return [];
    }
}

const FirstMergedItemTableComponent = (props) => {
    const [checkedItemListState, dispatchCheckedItemListState] = useReducer(checkedItemListStateReducer, initialCheckedItemListState);
    const [salesConfirmModalOpen, setSalesConfirmModalOpen] = useState(false);

    const _onSalesConfirmModalOpen = () => {
        if (!checkedItemListState || checkedItemListState.length <= 0) {
            alert('판매 취소 데이터를 선택해 주세요.');
            return;
        }
        setSalesConfirmModalOpen(true);
    }

    const _onSalesConfirmModalClose = () => {
        setSalesConfirmModalOpen(false);
    }

    // 판매 전환 서밋
    const _onSubmit_changeSalesYnForOrderItemList = () => {
        _onSalesConfirmModalClose();

        let data = checkedItemListState.map(r => {
            return {
                ...r,
                salesYn: 'n',
                salesAt: null
            }
        })

        props._onSubmit_changeSalesYnForOrderItemList(data);
        dispatchCheckedItemListState({
            type: 'CLEAR'
        })
    }

    const _onSubmit_fetchFirstMergeOrderItemList = () => {
        if (!checkedItemListState || checkedItemListState?.length <= 0) {
            alert('병합할 데이터를 먼저 선택해 주세요.');
            return;
        }

        props._onSubmit_fetchFirstMergeOrderItemList(checkedItemListState);

    }
    
    return (
        <>
            <Container>
                {props.headerState &&
                    <TableWrapper>
                        <TableBox>
                            <table cellSpacing="0">
                                <colgroup>
                                    {props.headerState?.headerDetail.details.map((r, index) => {
                                        return (
                                            <col key={index} width={'300px'}></col>
                                        );
                                    })}

                                </colgroup>
                                <thead>
                                    <tr>
                                        {props.headerState?.headerDetail.details.map((r, index) => {
                                            return (
                                                <th key={index} className="fiexed-header" scope="col">{r.customCellName}</th>
                                            )
                                        })}
                                    </tr>
                                </thead>

                                <tbody>
                                    {props.orderItemListState?.map((r1, rowIndex) => {
                                        return (
                                            <tr
                                                key={rowIndex}
                                            >
                                                {props.headerState?.headerDetail.details.map(r2 => {
                                                    let matchedColumnName = r2.matchedColumnName;
                                                    if (matchedColumnName === 'createdAt') {
                                                        return (
                                                            <td key={r2.cellNumber}>{dateToYYYYMMDDhhmmss(r1[matchedColumnName] || new Date())}</td>
                                                        )
                                                    }
                                                    return (
                                                        <td key={r2.cellNumber}>{r1[matchedColumnName]}</td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>

                            </table>
                        </TableBox>
                    </TableWrapper>
                }
                {(props.headerState) &&
                    <OperatorWrapper>
                        <div></div>
                        <ButtonBox style={{ marginTop: '10px' }}>
                            <button
                                className='common-btn-item'
                                onClick={_onSubmit_fetchFirstMergeOrderItemList}
                            >
                                2차 병합 하기
                                <Ripple color={'#f1f1f1'} duration={1000}></Ripple>
                            </button>
                        </ButtonBox>
                    </OperatorWrapper>
                }
                {!props.headerState &&
                    <div style={{ textAlign: 'center', padding: '100px 0', fontWeight: '600' }}>1차 병합 헤더를 먼저 설정해 주세요.</div>
                }
            </Container>

            {/* Modal */}
            <ConfirmModalComponent
                open={salesConfirmModalOpen}
                title={'판매 취소 확인 메세지'}
                message={`[ ${checkedItemListState.length} ] 건의 데이터를 판매 취소 하시겠습니까?`}

                onConfirm={_onSubmit_changeSalesYnForOrderItemList}
                onClose={_onSalesConfirmModalClose}
            ></ConfirmModalComponent>
        </>
    );
}
export default FirstMergedItemTableComponent;