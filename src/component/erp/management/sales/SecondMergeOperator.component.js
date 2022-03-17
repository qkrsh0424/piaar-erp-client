import { useState, useReducer, useMemo } from 'react';
import styled from 'styled-components';
import CommonModalComponent from '../../../module/modal/CommonModalComponent';
import SecondMergeHeaderSelectModalComponent from './SecondMergeHeaderSelectModal.component';
import SecondMergeHeaderAddModalComponent from './SecondMergeHeaderAddModal.component';
import FirstMergeHeaderEditModalComponent from './FirstMergeHeaderEditModal.component';
import Ripple from '../../../module/button/Ripple';
import { ButtonBox, Container, FlexWrapper } from './SecondMergeOperator.styled';
import SecondMergeHeaderEditModalComponent from './SecondMergeHeaderEditModal.component';

const SecondMergeOperatorComponent = (props) => {
    const [updateHeaderState, dispatchUpdateHeaderState] = useReducer(updateHeaderStateReducer, initialUpdateHeaderState);

    const [modalOpen, setModalOpen] = useState(false);
    const [addModeOpen, setAddModeOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const _onModalOpen = () => {
        setModalOpen(true);
    }

    const _onModalClose = () => {
        setModalOpen(false);
        _onAddModeClose();
        _onEditModalClose();
    }

    const _onAddModeOpen = () => {
        setAddModeOpen(true);
    }

    const _onAddModeClose = () => {
        setAddModeOpen(false);
    }

    const _onEditModalOpen = (data) => {
        dispatchUpdateHeaderState({
            type: 'INIT_DATA',
            payload: data
        })
        setEditModalOpen(true);
    }

    const _onEditModalClose = () => {
        setEditModalOpen(false);
    }

    const _onSelectHeader = (data) => {
        props._onChangeSecondMergeHeaderState(data);
        _onModalClose();
    }

    const _onSubmit_createSecondMergeHeader = (body) => {
        if (!body.title) {
            alert('헤더 타이틀을 지정해 주세요.');
            return;
        }

        if (!body.headerDetail?.details || body.headerDetail?.details.length <= 0) {
            alert('헤더 뷰 헤더를 설정해 주세요.');
            return;
        }
        props._onSubmit_createSecondMergeHeader(body)
        _onAddModeClose();
    }

    const _onSubmit_fetchSecondMergeOrderItemList = () => {
        props._onSubmit_fetchSecondMergeOrderItemList();
    }

    const _onSubmit_deleteSecondMergeHeader = (id) => {
        props._onSubmit_deleteSecondMergeHeader(id);
    }

    const _onSubmit_updateSecondMergeHeader = (body) => {
        props._onSubmit_updateSecondMergeHeader(body);
        _onEditModalClose();
    }

    return (
        <>
            {/* {props.firstMergedItemListState && */}
            <Container>
                <FlexWrapper>
                    <ButtonBox>
                        <div className='button-label'>2차 병합 헤더 선택</div>
                    </ButtonBox>
                </FlexWrapper>
                <FlexWrapper className='justify-between'>
                    <ButtonBox>
                        <button
                            className='button-item'
                            onClick={_onModalOpen}
                        >
                            {props.secondMergeHeaderState?.title ? props.secondMergeHeaderState?.title : '2차 병합 헤더 선택'}
                            <Ripple color={'#2C73D2'} duration={1000}></Ripple>
                        </button>
                    </ButtonBox>
                    <ButtonBox>
                        <button
                            className='fill-button-item'
                            onClick={_onSubmit_fetchSecondMergeOrderItemList}
                        >
                            2차 병합 하기
                            <Ripple color={'#e1e1e1'} duration={1000}></Ripple>
                        </button>
                    </ButtonBox>
                </FlexWrapper>
            </Container>
            {/* } */}
            {/* Modal */}
            <CommonModalComponent
                open={modalOpen}
                maxWidth={addModeOpen || editModalOpen ? 'lg' : 'xs'}
                onClose={_onModalClose}
            >
                <>
                    {modalOpen &&
                        <>
                            {(!addModeOpen && !editModalOpen) &&
                                <SecondMergeHeaderSelectModalComponent
                                    secondMergeHeaderListState={props.secondMergeHeaderListState}

                                    _onSubmit_deleteSecondMergeHeader={_onSubmit_deleteSecondMergeHeader}
                                    _onAddModeOpen={_onAddModeOpen}
                                    _onEditModalOpen={_onEditModalOpen}
                                    _onSelectHeader={_onSelectHeader}
                                ></SecondMergeHeaderSelectModalComponent>
                            }

                            {addModeOpen &&
                                <SecondMergeHeaderAddModalComponent
                                    _onAddModeClose={_onAddModeClose}
                                    _onSubmit_createSecondMergeHeader={_onSubmit_createSecondMergeHeader}
                                >
                                </SecondMergeHeaderAddModalComponent>
                            }

                            {editModalOpen &&
                                <SecondMergeHeaderEditModalComponent
                                    updateHeaderState={updateHeaderState}

                                    _onEditModeClose={_onEditModalClose}
                                    _onSubmit_updateSecondMergeHeader={_onSubmit_updateSecondMergeHeader}
                                >
                                </SecondMergeHeaderEditModalComponent>
                            }
                        </>
                    }

                </>
            </CommonModalComponent>
        </>
    );
}

export default SecondMergeOperatorComponent;

const initialUpdateHeaderState = null;

const updateHeaderStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        default: return null;
    }
}