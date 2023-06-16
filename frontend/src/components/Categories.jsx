import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (category) {
      navigate(`/categories/${category}`);
    } else {
      navigate('/');
    }
  };

  return (
    <NavDropdown title="Categories">
      <NavDropdown.Item onClick={() => handleCategoryClick('clothing')}>
        Clothing
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => handleCategoryClick('electronics')}>
        Electronics
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => handleCategoryClick('jewelry')}>
        Jewelry
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => handleCategoryClick('sports')}>
        Sports
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => handleCategoryClick('misc')}>
        Misc
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default Categories;
