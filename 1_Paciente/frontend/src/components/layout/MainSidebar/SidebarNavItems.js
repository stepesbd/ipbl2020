import React from 'react';
import { Nav } from 'shards-react';

import SidebarNavItem from './SidebarNavItem';
import SidebarNavItemsLink from './SidebarNavItemsLink';
import { Store } from '../../../flux';

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navItems: Store.getSidebarItems(),
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      navItems: Store.getSidebarItems(),
    });
  }

  render() {
    const { navItems: items } = this.state;
    return (
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {items.map((item, idx) => (
            <SidebarNavItem key={idx} item={item} />
          ))}

          <SidebarNavItemsLink
            item={{
              title: 'Monitoramento',
              to: 'https://stepesbdmedrecords.herokuapp.com/monitoring',
              htmlBefore: '<i class="material-icons">add_to_queue</i>',
            }}
          />
          <SidebarNavItemsLink
            item={{
              title: 'Hospitais',
              to: 'https://stepesbdhospital.herokuapp.com/',
              htmlBefore: '<i class="material-icons">local_hospital</i>',
            }}
          />
          <SidebarNavItemsLink
            item={{
              title: 'Fornecedores',
              to: 'http://juancanuto.pythonanywhere.com/',
              htmlBefore: '<i class="material-icons">add_shopping_cart</i>',
            }}
          />
        </Nav>
      </div>
    );
  }
}

export default SidebarNavItems;
