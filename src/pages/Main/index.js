import Divider from '../../components/Divider';
import Text from '../../components/Text';
import './main.css';

function Main() {

  return (
    <div class="main-container">
      <div class="main-left">
        <div class="main-left-up">
          <Text>Esquerda Cima 1</Text>
          <Divider/>
          <Text>Esquerda Cima 2</Text>
        </div>
        <div class="main-left-down"> Esquerda baixo </div>
      </div>
      <div class="main-right"> Direita </div>
    </div>
  );
}

export default Main;
