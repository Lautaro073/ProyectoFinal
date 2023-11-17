import '../../css/Carrusel.css'
import inst1 from '../../assets/photo_2023-07-28_20-16-17.jpg'
import inst2 from '../../assets/photo_2023-07-28_20-16-17.jpg'
import inst3 from '../../assets/photo_2023-07-28_20-16-17.jpg'
import inst4 from '../../assets/photo_2023-07-28_20-16-17.jpg'
import inst5 from '../../assets/photo_2023-07-28_20-16-17.jpg'
import inst6 from '../../assets/photo_2023-07-28_20-16-17.jpg'
function Carrusel(){
    return(
        <>
        <div className='fondo-carrusel' id='Instalaciones'>
          
            <div className='container-all'>
                <input type='radio' id='1' name='image-slidee' hidden/>
                <input type='radio' id='2' name='image-slidee' hidden/>
                <input type='radio' id='3' name='image-slidee' hidden/>
                <input type='radio' id='4' name='image-slidee' hidden/>
                <input type='radio' id='5' name='image-slidee' hidden/>
                <input type='radio' id='6' name='image-slidee' hidden/>

            <div className='slidee'>
            <div className='item-slidee'>
                <img alt='inst1' src={inst1}/>
            </div>
            <div className='item-slidee'>
                <img alt='inst2' src={inst2}/>
            </div>
            <div className='item-slidee'>
                <img alt='inst3' src={inst3}/>
            </div>
            <div className='item-slidee'>
                <img alt='inst4' src={inst4}/>
            </div>
            <div className='item-slidee'>
                <img alt='inst5' src={inst5}/>
            </div>
            <div className='item-slidee'>
                <img alt='inst6' src={inst6}/>
            </div>
            </div>
     
            <div className='pagination'>
                <label className='pagination-item' htmlFor="1">
                    <img alt='inst1' src={inst1}/>
                </label>
                <label className='pagination-item' htmlFor="2">
                    <img alt='inst2' src={inst2}/>
                </label>
                <label className='pagination-item' htmlFor="3">
                    <img alt='inst3' src={inst3}/>
                </label>
                <label className='pagination-item' htmlFor="4">
                    <img alt='inst4' src={inst4}/>
                </label>
                <label className='pagination-item' htmlFor="5">
                    <img alt='inst5' src={inst5}/>
                </label>
                <label className='pagination-item' htmlFor="6">
                    <img alt='inst6' src={inst6}/>
                </label>
            </div>
            </div> 
        </div>
         </>
    )
}
export default Carrusel;