import React, { Fragment, useContext } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const ActivityFilters = () => {
  const rootStore = useContext(RootStoreContext);

  const { predicate, setPredicate } = rootStore.activityStore;

  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
        <Menu.Item
          onClick={() => setPredicate('all', 'true')}
          active={predicate.size === 0}
          color={'blue'}
          name={'all'}
          content={'All Activities'}
        />
        <Menu.Item
          onClick={() => setPredicate('isGoing', 'true')}
          color={'blue'}
          active={predicate.has('isGoing')}
          name={'username'}
          content={"I'm Going"}
        />
        <Menu.Item
          onClick={() => setPredicate('isHost', 'true')}
          color={'blue'}
          name={'host'}
          active={predicate.has('isHost')}
          content={"I'm hosting"}
        />
      </Menu>
      <Header
        icon={'calendar'}
        attached
        color={'teal'}
        content={'Select Date'}
      />
      <Calendar
        onChange={date => setPredicate('startDate', date!)}
        value={predicate.get('startDate') || new Date()}
      />
    </Fragment>
  );
};

export default observer(ActivityFilters);
