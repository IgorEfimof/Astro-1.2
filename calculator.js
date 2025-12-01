// Основной скрипт приложения
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const citySelect = document.getElementById('city');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingElement = document.getElementById('loading');
    
    // Устанавливаем текущую дату по умолчанию
    const now = new Date();
    dateInput.value = now.toISOString().split('T')[0];
    
    // Инициализация астрологического движка
    let astrologyEngine = null;
    
    // Функция инициализации
    function initAstrologyEngine() {
        try {
            astrologyEngine = new AstrologyCore();
            loadingElement.style.display = 'none';
            console.log('Астрологический движок загружен');
        } catch (error) {
            loadingElement.innerHTML = `
                <p style="color: #ef4444;">Ошибка загрузки движка:</p>
                <p>${error.message}</p>
            `;
        }
    }
    
    // Функция расчета
    function calculate() {
        if (!astrologyEngine) {
            alert('Астрологический движок еще не загружен');
            return;
        }
        
        const dateStr = dateInput.value;
        const timeStr = timeInput.value;
        const selectedCity = citySelect.value;
        
        if (!dateStr || !timeStr) {
            alert('Пожалуйста, выберите дату и время');
            return;
        }
        
        // Создаем объект Date
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        // Создаем дату в московском времени (UTC+3)
        const moscowDate = new Date(Date.UTC(year, month - 1, day, hours - 3, minutes));
        
        // Определяем города для расчета
        const cities = selectedCity === 'all' 
            ? ['Москва', 'Иваново', 'Липецк', 'Санкт-Петербург']
            : [selectedCity];
        
        // Выполняем расчет
        const results = cities.map(city => {
            return astrologyEngine.calculateForCity(moscowDate, city);
        });
        
        // Отображаем результаты
        displayResults(results);
    }
    
    // Функция отображения результатов
    function displayResults(results) {
        let html = '';
        
        results.forEach(result => {
            html += `
                <div class="city-result">
                    <h3 style="color: #60a5fa; margin-bottom: 10px;">
                        🏙️ ${result.city}
                    </h3>
                    <p style="color: #94a3b8; font-size: 14px; margin-bottom: 15px;">
                        📅 Местное время: ${result.localTime}<br>
                        🌐 UTC: ${result.utcTime}
                    </p>
                    <div style="background: rgba(30, 41, 59, 0.5); padding: 15px; border-radius: 8px;">
            `;
            
            // Добавляем каждую планету
            for (const [planetName, data] of Object.entries(result.planets)) {
                html += `
                    <div class="planet-row">
                        <div class="planet-name">
                            ${data.symbol} ${planetName}
                        </div>
                        <div class="planet-position">
                            ${data.sign} ${data.degrees}°
                        </div>
                    </div>
                `;
            }
            
            html += `
                    </div>
                    <p style="margin-top: 10px; font-size: 12px; color: #64748b;">
                        * Упрощенный расчет. Для точных данных используйте профессиональные эфемериды.
                    </p>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
    }
    
    // Обработчики событий
    calculateBtn.addEventListener('click', calculate);
    
    // Инициализация при загрузке
    setTimeout(initAstrologyEngine, 100);
    
    // Добавляем кнопку для тестирования разных дат
    const testDates = [
        {name: 'Новый год', date: '2024-12-31', time: '00:00'},
        {name: 'Весеннее равноденствие', date: '2024-03-20', time: '12:00'},
        {name: 'Летнее солнцестояние', date: '2024-06-21', time: '12:00'},
        {name: 'Сейчас', date: now.toISOString().split('T')[0], time: now.toTimeString().substring(0,5)}
    ];
    
    const testContainer = document.createElement('div');
    testContainer.style.marginTop = '20px';
    testContainer.innerHTML = '<p style="margin-bottom: 10px; color: #94a3b8;">Быстрые тесты:</p>';
    
    testDates.forEach(test => {
        const btn = document.createElement('button');
        btn.textContent = test.name;
        btn.style.cssText = `
            background: #475569;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 6px;
            margin: 5px;
            font-size: 14px;
            cursor: pointer;
        `;
        
        btn.addEventListener('click', () => {
            dateInput.value = test.date;
            timeInput.value = test.time;
            setTimeout(calculate, 100);
        });
        
        testContainer.appendChild(btn);
    });
    
    document.querySelector('.controls').appendChild(testContainer);
});
